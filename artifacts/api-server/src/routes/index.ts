import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import trackingRouter from "./tracking";
import couriersRouter from "./couriers";
import trackUpdatesRouter from "./trackUpdates";
import officersRouter from "./officers";
import officesRouter from "./offices";
import dashboardRouter from "./dashboard";
import contactRouter from "./contact";
import adminEmailRouter from "./adminEmail";
import adminSmsRouter from "./adminSms";
import settingsRouter from "./settings";
import adminSettingsRouter from "./adminSettings";
import adminInboxRouter from "./adminInbox";
import webhookResendInboundRouter from "./webhookResendInbound";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(trackingRouter);
router.use(couriersRouter);
router.use(trackUpdatesRouter);
router.use(officersRouter);
router.use(officesRouter);
router.use(dashboardRouter);
router.use(contactRouter);
router.use(adminEmailRouter);
router.use(adminSmsRouter);
router.use(settingsRouter);
router.use(adminSettingsRouter);
router.use(adminInboxRouter);
router.use(webhookResendInboundRouter);

export default router;
