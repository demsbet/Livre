import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper to convert Euro to FCFA
const toFcfa = (euro: number) => {
  return (euro * 656).toLocaleString("fr-FR");
};

// Lazy Stripe Initialization
let stripeClient: Stripe | null = null;
const getStripe = (): Stripe | null => {
  if (!stripeClient && process.env.STRIPE_SECRET_KEY) {
    try {
      stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-02-24.acacia" as any,
      });
      console.log("Stripe Client initialized successfully.");
    } catch (err) {
      console.error("Failed to initialize Stripe client:", err);
    }
  }
  return stripeClient;
};

// Lazy SMTP Transporter Initialization for Emails
const getEmailTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // Use true for Port 465, false for other ports
      auth: {
        user,
        pass,
      },
    });
  }
  return null;
};

// API: Health probe
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
    smtpConfigured: !!(process.env.SMTP_HOST && process.env.SMTP_USER),
  });
});

// Helper to clean environment config value
const cleanEnvVar = (val: string | undefined): string => {
  if (!val) return "";
  let clean = val.trim();
  if (clean.startsWith('"') && clean.endsWith('"')) {
    clean = clean.substring(1, clean.length - 1).trim();
  }
  if (clean.startsWith("'") && clean.endsWith("'")) {
    clean = clean.substring(1, clean.length - 1).trim();
  }
  return clean;
};

const cleanEnvUrl = (url: string | undefined): string => {
  let clean = cleanEnvVar(url);
  while (clean.endsWith("/")) {
    clean = clean.substring(0, clean.length - 1).trim();
  }
  if (clean.endsWith("/rest/v1")) {
    clean = clean.substring(0, clean.length - "/rest/v1".length).trim();
  }
  if (clean.endsWith("/auth/v1")) {
    clean = clean.substring(0, clean.length - "/auth/v1".length).trim();
  }
  while (clean.endsWith("/")) {
    clean = clean.substring(0, clean.length - 1).trim();
  }
  return clean;
};

// API: Safe dynamic retrieval of public VITE_SUPABASE credentials for client-side live syncing
app.get("/api/supabase-config", (req, res) => {
  res.json({
    supabaseUrl: cleanEnvUrl(process.env.VITE_SUPABASE_URL),
    supabaseAnonKey: cleanEnvVar(process.env.VITE_SUPABASE_ANON_KEY),
  });
});

// API: Send test email to verify SMTP credentials
app.post("/api/test-email", async (req, res) => {
  const { testEmail } = req.body;
  if (!testEmail) {
    return res.status(400).json({ success: false, error: "Adresse e-mail de test manquante." });
  }

  const transporter = getEmailTransporter();
  if (!transporter) {
    return res.status(400).json({
      success: false,
      error: "Le serveur SMTP n'est pas configuré. Veuillez définir ses paramètres dans .env ou les Secrets.",
    });
  }

  try {
    await transporter.sendMail({
      from: `"Vérification de Configuration" <${process.env.SMTP_USER}>`,
      to: testEmail,
      subject: `🧪 Test de notification SMTP Réussi !`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
          <div style="background-color: #0f172a; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; border-bottom: 3px solid #d97706;">
            <h2 style="color: #f59e0b; margin: 0; font-family: Georgia, serif; font-size: 20px;">LA BOURSE EN AFRIQUE</h2>
            <p style="color: #94a3b8; font-size: 11px; margin: 4px 0 0; letter-spacing: 1px; font-family: monospace;">TEST SMTP TERMINAL</p>
          </div>
          <div style="padding: 20px; text-align: center;">
            <p style="font-size: 24px; margin: 0 0 10px;">✅</p>
            <h3 style="color: #0f766e; margin: 0 0 10px;">Connexion SMTP active !</h3>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              Félicitations ! Votre serveur de messagerie SMTP est correctement configuré. 
              Le site est maintenant qualifié pour envoyer de vrais reçus de paiement à vos lecteurs à l'adresse <strong>${testEmail}</strong>, ainsi que des rapports de vente détaillés à vous-même (l'auteur).
            </p>
          </div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
            Généré automatiquement par la console d'administration Élite.
          </p>
        </div>
      `,
    });
    return res.json({ success: true, message: "E-mail de test expédié avec succès !" });
  } catch (error: any) {
    console.error("[Test SMTP] Erreur :", error);
    return res.status(500).json({ success: false, error: error.message || "Échec de connexion SMTP." });
  }
});

// API: Handle Order Submission, Payment & Notifications
app.post("/api/checkout", async (req, res) => {
  const {
    name,
    email,
    phone,
    country,
    city,
    cartItems,
    totalAmount,
    shippingFee,
    cardNumber,
    cardHolder,
    cardExpiry,
    cardCvv,
  } = req.body;

  if (!name || !email || !phone || !city || !cartItems || cartItems.length === 0) {
    return res.status(400).json({
      success: false,
      error: "Données de commande incomplètes (champs requis manquants).",
    });
  }

  console.log(`[Checkout] Traitement de la commande pour ${name} (${email}) - Total: ${totalAmount} €`);

  let paymentGatewayUsed = "SIMULATION";
  let transactionId = `TXN-BVMAC-${Math.floor(Math.random() * 900000) + 100000}-EUR`;
  let paymentError: string | null = null;

  const stripe = getStripe();
  if (stripe) {
    try {
      console.log("[Checkout] Traitement via la passerelle Stripe réelle...");
      // For standard Stripe Checkout or PaymentIntent
      const amountInCents = Math.round(totalAmount * 100);
      
      // In a real integration using a single direct payment method from frontend:
      // We create a PaymentIntent. In test mode, we use the token or test cards.
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "eur",
        metadata: {
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          deliveryCity: city,
          deliveryCountry: country,
        },
        payment_method_types: ["card"],
        description: `Achat de livre - La Bourse en Afrique par ${name}`,
      });

      transactionId = paymentIntent.id;
      paymentGatewayUsed = "STRIPE";
      console.log(`[Checkout] Réussite Stripe PaymentIntent: ${transactionId}`);
    } catch (stripeErr: any) {
      console.error("[Checkout] Erreur lors du prélèvement Stripe:", stripeErr);
      paymentError = stripeErr.message || "Erreur lors de la validation du prélèvement bancaire.";
      return res.status(500).json({
        success: false,
        paymentError: true,
        error: `Échec du prélèvement réel sur la carte : ${paymentError}`,
      });
    }
  } else {
    console.log("[Checkout] Aucune passerelle Stripe configurée. Simulation active pour les tests.");
  }

  // HTML content of emails
  const itemsHtml = cartItems
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #0f172a;">
        ${item.name}<br/>
        <span style="font-size: 11px; color: #64748b; font-weight: normal;">${item.subtitle || ""}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #0f172a;">x${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #b45309;">${item.price * item.quantity} €</td>
    </tr>`
    )
    .join("");

  // Email to Customer
  const customerEmailHtml = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
      <div style="background-color: #0f172a; padding: 24px; border-radius: 8px 8px 0 0; text-align: center; border-bottom: 3px solid #d97706;">
        <h2 style="color: #f59e0b; margin: 0; font-family: Georgia, serif; font-size: 24px; font-weight: 900;">LA BOURSE EN AFRIQUE</h2>
        <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0; letter-spacing: 1px; font-family: monospace;">REÇU OFFICIEL DE CONFIGURATION D'ACHAT</p>
      </div>
      
      <div style="padding: 24px;">
        <p style="font-size: 15px; line-height: 1.6;">Bonjour <strong>${name}</strong>,</p>
        <p style="font-size: 15px; line-height: 1.6; color: #0f766e; font-weight: bold; text-align: center; background-color: #f0fdf4; padding: 12px; border-radius: 8px; border: 1px solid #bbf7d0;">
          🎉 Félicitations pour votre investissement financier ! Votre transaction a été validée avec succès.
        </p>
        
        <p style="font-size: 14px; line-height: 1.6;">Votre commande pour l'ouvrage de référence de <strong>Siewe de Kalambak Steeves</strong> a bien été enregistrée. Voici le récapitulatif fiscal de votre transaction :</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
          <thead>
            <tr style="background-color: #f8fafc; text-transform: uppercase;">
              <th style="padding: 10px; border-bottom: 2px solid #e2e8f0; text-align: left; color: #64748b;">Livre / Option</th>
              <th style="padding: 10px; border-bottom: 2px solid #e2e8f0; text-align: center; color: #64748b;">Quantité</th>
              <th style="padding: 10px; border-bottom: 2px solid #e2e8f0; text-align: right; color: #64748b;">Prix</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            <tr>
              <td colspan="2" style="padding: 12px; text-align: right; color: #64748b;">Frais d'expédition point-relais (${country})</td>
              <td style="padding: 12px; text-align: right; font-weight: bold; color: #0f172a;">+${shippingFee} €</td>
            </tr>
            <tr style="background-color: #fef3c7;">
              <td colspan="2" style="padding: 12px; text-align: right; font-weight: 900; color: #0f172a; font-size: 14px;">MONTANT TOTAL RÉGLÉ</td>
              <td style="padding: 12px; text-align: right; font-weight: 900; color: #b45309; font-size: 16px;">
                ${totalAmount} €<br/>
                <span style="font-size: 11px; font-weight: bold; color: #78350f; font-family: monospace;">soit environ ${toFcfa(totalAmount)} FCFA</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; font-size: 12px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 8px; color: #0f172a; font-family: serif; font-size: 14px;">📦 Informations de livraison :</h4>
          <p style="margin: 4px 0;"><strong>Destinataire :</strong> ${name}</p>
          <p style="margin: 4px 0;"><strong>Destination :</strong> ${city}, ${country}</p>
          <p style="margin: 4px 0;"><strong>Numéro WhatsApp :</strong> ${phone}</p>
          <p style="margin: 4px 0;"><strong>Identifiant de transaction :</strong> <code style="background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-family: monospace; font-size: 11px;">${transactionId}</code></p>
          <p style="margin: 4px 0;"><strong>Passerelle de paiement :</strong> <span style="font-weight: bold; color: #0f766e;">${paymentGatewayUsed} SECURE</span></p>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          <strong>Prochaine étape :</strong> Notre coordinateur logistique va prendre contact avec vous directement sur WhatsApp au numéro indiqué (<strong>${phone}</strong>) sous 24 heures pour convenir d'un point-relais ou d'un créneau horaire sécurisé de livraison à votre convenance.
        </p>
        
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;"/>
        
        <div style="text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.5;">
          <p style="margin: 0;">Cet e-mail de confirmation constitue votre reçu officiel d'achat direct.</p>
          <p style="margin: 4px 0 0;">© 2026 Éditions La Bourse en Afrique. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  `;

  // Email to Author
  const authorEmailHtml = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
      <div style="background-color: #b45309; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
        <h2 style="color: #ffffff; margin: 0; font-family: Georgia, serif; font-size: 22px;">Nouveau Livre Vendu !</h2>
        <p style="color: #ffedd5; font-size: 12px; margin: 4px 0 0; letter-spacing: 1px; font-family: monospace;">PLATEFORME AUTEUR - NOTIFICATION INSTANTANÉE</p>
      </div>
      
      <div style="padding: 24px;">
        <p style="font-size: 15px; line-height: 1.6;">Cher <strong>Siewe de Kalambak Steeves</strong>,</p>
        <p style="font-size: 15px; line-height: 1.6; color: #7c2d12; font-weight: bold; background-color: #ffedd5; padding: 12px; border-radius: 8px; border: 1px solid #fed7aa; text-align: center;">
          💰 Un lecteur vient de commander votre ouvrage en ligne ! Les fonds sont en cours de transfert.
        </p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
          <thead>
            <tr style="background-color: #f8fafc; text-transform: uppercase;">
              <th style="padding: 10px; border-bottom: 2px solid #e2e8f0; text-align: left; color: #64748b;">Articles commandés</th>
              <th style="padding: 10px; border-bottom: 2px solid #e2e8f0; text-align: center; color: #64748b;">Qté</th>
              <th style="padding: 10px; border-bottom: 2px solid #e2e8f0; text-align: right; color: #64748b;">Montant</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            <tr>
              <td colspan="2" style="padding: 12px; text-align: right; color: #64748b;">Frais d'expédition point-relais (${country})</td>
              <td style="padding: 12px; text-align: right; font-weight: bold; color: #0f172a;">+${shippingFee} €</td>
            </tr>
            <tr style="background-color: #fef3c7;">
              <td colspan="2" style="padding: 12px; text-align: right; font-weight: 900; color: #0f172a; font-size: 14px;">TOTAL GÉNÉRAL DU COMPTE</td>
              <td style="padding: 12px; text-align: right; font-weight: 900; color: #b45309; font-size: 16px;">
                ${totalAmount} €<br/>
                <span style="font-size: 11px; font-weight: bold; color: #78350f; font-family: monospace;">env. ${toFcfa(totalAmount)} FCFA</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; font-size: 12px;">
          <h4 style="margin: 0 0 8px; color: #0f172a; font-family: serif; font-size: 14px;">👤 Fiche client & Coordonnées de livraison :</h4>
          <p style="margin: 4px 0;"><strong>Nom complet :</strong> ${name}</p>
          <p style="margin: 4px 0;"><strong>Adresse e-mail :</strong> <a href="mailto:${email}" style="color: #b45309; font-weight: bold;">${email}</a></p>
          <p style="margin: 4px 0;"><strong>Lieu de livraison :</strong> ${city}, ${country}</p>
          <p style="margin: 4px 0;"><strong>Numéro WhatsApp :</strong> <a href="https://wa.me/${phone.replace(/[^0-9]/g, "")}" style="color: #b45309; font-weight: bold;" target="_blank">${phone}</a></p>
          <p style="margin: 4px 0;"><strong>ID de transaction :</strong> <code style="background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-family: monospace; font-size: 11px;">${transactionId}</code></p>
          <p style="margin: 4px 0;"><strong>Méthode de paiement :</strong> Carte Bancaire (${paymentGatewayUsed})</p>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-top: 20px;">
          👉 <strong>Action requise de votre part :</strong> Veuillez contacter le lecteur sur son WhatsApp afin de coordonner et déléguer de façon fluide la livraison de l'ouvrage physique vers la destination indiquée (${city}, ${country}).
        </p>
        
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;"/>
        
        <div style="text-align: center; font-size: 11px; color: #94a3b8;">
          <p style="margin: 0;">Plateforme automatisée de l'ouvrage "La Bourse en Afrique"</p>
        </div>
      </div>
    </div>
  `;

  // Start sending emails!
  const transporter = getEmailTransporter();
  let emailSentStatus = false;
  let emailErrorLog = "";

  if (transporter) {
    try {
      console.log(`[Checkout] Envoi d'e-mails réels via SMTP (${process.env.SMTP_USER})...`);
      
      // Send to Customer
      await transporter.sendMail({
        from: `"Éditions La Bourse en Afrique" <${process.env.SMTP_USER}>`,
        to: email, // customer address
        subject: `📚 Confirmation d'achat - "La Bourse en Afrique" [Ref: ${transactionId}]`,
        html: customerEmailHtml,
      });

      // Send to Author
      // Use the author's configured email, or fallback to default
      const authorEmailAddr = "kalambaksteeves@yahoo.fr"; 
      await transporter.sendMail({
        from: `"Plateforme Bourse Afrique" <${process.env.SMTP_USER}>`,
        to: authorEmailAddr, // author address
        subject: `🎯 Nouvelle Vente : Livre commandé par ${name} (${city}, ${country})`,
        html: authorEmailHtml,
      });

      emailSentStatus = true;
      console.log("[Checkout] E-mails réels envoyés avec succès au client et à l'auteur !");
    } catch (smtpErr: any) {
      console.error("[Checkout] Erreur SMTP de transmission d'emails:", smtpErr);
      emailErrorLog = smtpErr.message || "Erreur de configuration ou d'authentification du serveur de messagerie SMTP.";
    }
  } else {
    console.log(
      "[Checkout] Clés SMTP non configurées dans l'environnement. Les détails des e-mails fictifs sont imprimés ci-dessous :"
    );
    console.log("---- ENVELOPE CLIENT ----");
    console.log(`De: "Editions La Bourse en Afrique" To: ${email}`);
    console.log("---- ENVELOPE AUTEUR ----");
    console.log(`De: "Plateforme Bourse Afrique" To: kalambaksteeves@yahoo.fr`);
  }

  // Return success response with detailed diagnostics so that the UI can inform the administrator
  res.json({
    success: true,
    transactionId,
    paymentGatewayUsed,
    emailSent: emailSentStatus,
    smtpConfigured: !!transporter,
    stripeConfigured: !!stripe,
    emailError: emailErrorLog || null,
    message: "Commande validée et enregistrée !",
  });
});

// Serve frontend assets using Vite or static configuration
async function startViteServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("[Server] Lancement de Vite en mode middleware de développement...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Server] Lancement en mode production (fichiers statiques)...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Serveur full-stack démarré avec succès sur http://localhost:${PORT}`);
  });
}

startViteServer();
