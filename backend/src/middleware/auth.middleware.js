import { clerkClient ,getAuth} from "@clerk/express";

export const protectRoute = async (req, res, next) => {
const { isAuthenticated, userId } = getAuth(req)


  if (!isAuthenticated) {
     return res.status(401).json({ error: 'Unauthorized - you are not logged in' })
   
  }
	next();
};

export const requireAdmin = async (req, res, next) => {

	try {
		const { userId } = getAuth(req)
		const currentUser = await clerkClient.users.getUser(userId);
		const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;
		

		if (!isAdmin) {
			return res.status(403).json({ message: "Unauthorized - you must be an admin" });
		}

		next();
	} catch (error) {
		next(error);
	}
};
