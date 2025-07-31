import { Router } from "express";
import { cancelRegistration, createEvent, eventStats, getEventDetails, registerEvent, upcomingEvents } from "../controllers/event.controllers.js";

const eventRoutes = Router()

eventRoutes.post("/create-event", createEvent)
eventRoutes.get("/get-events", getEventDetails)
eventRoutes.post("/register-event", registerEvent)
eventRoutes.delete("/cancel-event", cancelRegistration)
eventRoutes.get("/all-upcoming-events", upcomingEvents)
eventRoutes.get("/stats/:eventId", eventStats)

export default eventRoutes