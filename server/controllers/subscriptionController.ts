import { Request, Response } from 'express';
import { Logger } from '../middlewares/logger';
import db from '../models';

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const userId = req.params.uid;
    const user = await db.User.findOne({
        where: {
            uid: userId
        }
    });

    if(!user) {
        return res.status(404).json({
            status: 'ERROR',
            message: 'User not found, invalid user uid.',
          });
    }

    const getSubscription = await db.Subscription.findOne({
      where: {
          uid: userId
      }
  });

    if(getSubscription) {
        return res.status(404).json({
            status: 'ERROR',
            message: 'The user already has one subscription, please update instead!',
          });
    }

  const { subscription } = req.body;
  const createSubscription = await db.Subscription.create({
    uid: userId,
    subscription: subscription
  });

  return res.status(201).json({
      status: 'SUCCESS',
      data: createSubscription
  });

    
} catch (error) {
        Logger.error(`Error occurred while creating subscription: ${error}`);
            return res.status(400).json({
            status: 'ERROR',
            message: `Error creating subscription: ${error}`,
        });
    }
  };

export const getSubscription = async (req: Request, res: Response) => {
  try{
    const userId = req.params.uid;
    const user = await db.User.findOne({
        where: {
            uid: userId
        }
    });

    if(!user) {
        return res.status(404).json({
            status: 'ERROR',
            message: 'User not found, invalid user uid.',
          });
    }

    const getSubscription = await db.Subscription.findOne({
      where: {
          uid: userId
      }
  });

    if(!getSubscription) {
        return res.status(404).json({
            status: 'ERROR',
            message: 'No subscription exist for this user, please create.',
          });
    }

    return res.status(200).json({
        status: 'SUCCESS',
        data: getSubscription
    });
} catch (error) {
    Logger.error(`Error occurred while fetching subscription: ${error}`);
    return res.status(400).json({
        status: 'ERROR',
        message: `Error fetching subscription: ${error}`,
    });
}
};

export const updateSubscription = async (req: Request, res: Response) => {
  try {
    const userId = req.params.uid;

    const user = await db.User.findOne({
      where: {
          uid: userId
      }
  });

    if(!user) {
        return res.status(404).json({
            status: 'ERROR',
            message: 'User not found, invalid user uid.',
          });
    }

    const getSubscription = await db.Subscription.findOne({
      where: {
          uid: userId
      }
  });

    if(!getSubscription) {
        return res.status(404).json({
            status: 'ERROR',
            message: 'No subscription exist for this user.',
          });
    }

    const { subscription } = req.body;
    await db.Subscription.update({
      subscription,
    }, {
       where: {
          uid: userId
       }
    })

    const getUpdatedSubscription = await db.Subscription.findOne({
      where: {
          uid: userId
      }
  });

    res.status(200).json({
      status: `SUCCESS`,
      data: getUpdatedSubscription,
    });

  } catch (err) {
    Logger.error(`Error occurred while deleting appointment: ${err}`);
    res.status(400).json({
      status: "ERROR",
      message: `Error deleting appointment record: ${err}`,
    });
  }
};

export const deleteSubscription= async (req: Request, res: Response) => {
  try {
    const userId = req.params.uid;

    const user = await db.User.findOne({
      where: {
          uid: userId
      }
  });

    if(!user) {
        return res.status(404).json({
            status: 'ERROR',
            message: 'User not found, invalid user uid.',
          });
    }

    const getSubscription = await db.Subscription.findOne({
      where: {
          uid: userId
      }
  });

    if(!getSubscription) {
        return res.status(404).json({
            status: 'ERROR',
            message: 'No subscription exist for this user.',
          });
    }

    await db.Subscription.destroy({
      where: {
        uid: userId,
      },
    });

    res.status(200).json({
      status: `SUCCESS`,
      data: `Successfully deleted appointment.`,
    });
  } catch (err) {
    Logger.error(`Error occurred while deleting appointment: ${err}`);
    res.status(400).json({
      status: "ERROR",
      message: `Error deleting appointment record: ${err}`,
    });
  }
};