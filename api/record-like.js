import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { likerAddress, likedAddress, direction } = req.body;

  if (!likerAddress || !likedAddress || !direction) {
    return res.status(400).json({ error: 'Missing required address or direction' });
  }

  if (direction === 'right') {
    try {
      // 1. Record the new "like" in the database
      // This will fail safely if a like already exists due to the @@unique constraint
      await prisma.like.create({
        data: {
          likerAddress: likerAddress,
          likedAddress: likedAddress,
        },
      });

      // 2. Check if the other person has already liked you back (a mutual like)
      const mutualLike = await prisma.like.findUnique({
        where: {
          likerAddress_likedAddress: {
            // We are looking for a record where the LIKER was the person you just liked...
            likerAddress: likedAddress,
            // ...and the person they LIKED was you.
            likedAddress: likerAddress, // <-- THIS WAS THE BUG. Corrected to likerAddress.
          },
        },
      });

      // 3. If a mutual like exists, it's a match!
      if (mutualLike) {
        // You can add logic here to create the Connection and Notifications
        // For now, we'll just return the match status.
        return res.status(200).json({ success: true, match: true });
      }

    } catch (error) {
      // This will catch errors like trying to like the same person twice.
      // We can safely ignore it for this flow and just treat it as not a match.
      console.error(error);
      return res.status(200).json({ success: true, match: false });
    }
  }

  // For left swipes or successful right swipes without a match
  return res.status(200).json({ success: true, match: false });
}