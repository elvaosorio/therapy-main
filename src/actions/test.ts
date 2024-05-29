import { createGCalEvent } from "@/actions/gcal";
import logger from "@/trpc/util/logger";

async function test() {
    const link = await createGCalEvent({
        title: "Test Event",
        description: "This is a test event",
        startTimeUTC: new Date(),
        endTimeUTC: new Date(Date.now() + 60 * 60 * 1000),
    });

    logger.info(`Created event: ${link}`);
}

test();
