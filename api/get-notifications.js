import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Log when the function is called
  console.log("API ROUTE: /api/get-notifications was hit.");

  try {
    const { userAddress } = req.query;
    console.log("Fetching notifications for address:", userAddress);

    if (!userAddress) {
      return res.status(400).json({ error: 'userAddress query parameter is required' });
    }

    const notifications = await prisma.notification.findMany({
      where: { recipientAddress: userAddress },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`Found ${notifications.length} notifications.`);
    return res.status(200).json(notifications);

  } catch (error) {
    // This will log the detailed error to your terminal
    console.error("ERROR IN /api/get-notifications:", error);
    return res.status(500).json({ error: "An internal server error occurred." });
  }
}