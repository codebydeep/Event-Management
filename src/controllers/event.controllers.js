import {db} from "../libs/db.js"
import { isPast } from "date-fns"

const createEvent = async (req, res) => {
    const { title, dateTime, location, capacity } = req.body

    if(!title || !dateTime || !location || !capacity){
        return res.status(400).json({
            success: false,
            message: "All the details are required"
        })
    }

    if (capacity <= 0 || capacity > 1000) {
        return res.status(400).json({ 
            success: false, 
            message: "Capacity must be between 1 and 1000" 
        });
    }

    try {
        const existingEvent = await db.event.findFirst({
            where: {
                title,
            }
        })

        if(existingEvent){
            res.status(400).json({
                success: false,
                message: "Event already exists!"
            })
        }

        const newEvent = await db.event.create({
            data: {
                title, 
                dateTime: new Date(dateTime), 
                location, 
                capacity, 
                // registrations : noOfRegistrations
            }
        })

        res.status(201).json({
            success: true,
            message: "Event created",
            newEventId: newEvent.id
        })

    } catch (error) {
        console.error("Error while checking/creating event:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

const getEventDetails = async (req, res) => {
    try {
        const Events = await db.event.findMany({
            include: {
                registrations: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })
        
        if(!Events){
            return res.status(400).json({
                success: false,
                message: "No Events found"
            })
        }

        return res.status(201).json({
            success: true,
            message: "Events fetched Successfully!",
            Events
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in fetching Events~",
            error: error.message
        })
    }
}


const registerEvent = async (req, res) => {
    const {name, email, eventId} = req.body

    if (!name || !email || !eventId) {
        return res.status(400).json({ 
            success: false, 
            message: "All fields are required" 
        });
    }

    try {
        const event = await db.event.findUnique({
            where: { 
                id: eventId
            },
            include: { 
                registrations: true
            }
        });

        if(!event){
            return res.status(400).json({
                success: false,
                message: "Event not found"
            })
        }

        if (isPast(new Date(event.dateTime))) {
            return res.status(400).json({
                success: false,
                message: "Cannot register for past events"
            });
        }

        if (event.registrations.length >= event.capacity) {
            return res.status(400).json({
                success: false,
                message: "Event is already full"
            });
        }


        let user = await db.user.findUnique({ 
            where: { 
                email 
            } 
        });

        if (!user) {
            user = await db.user.create({
                data: { 
                    name, 
                    email 
                }
            });
        }

        const alreadyRegistered = event.registrations.some(
            (reguser) => reguser.id === user.id
        );

        if (alreadyRegistered) {
            return res.status(400).json({
                success: false,
                message: "User already registered for this event"
            });
        }

        // await db.registration.create({
        //     data: {
        //         eventId: event.id,
        //         userId: user.id
        //     }
        // });

        await db.event.update({
      where: { id: event.id },
      data: {
        registrations: {
          connect: { id: user.id }
        }
      }
    });

        res.status(201).json({
            success: true,
            message: "User registered for Event"
        })

    } catch (error) {
        return res.status(500).json({
                success: false,
                message: "Error in registered for Event",
                error: error.message
        })   
    }    
}

const cancelRegistration = async (req, res) => {
    const { email, eventId } = req.body;

    try {
        const user = await db.user.findUnique({ 
            where: { 
                email 
            } 
        });

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        
        const event = await db.event.findUnique({
            where: { 
                id: eventId 
            },
            include: { 
                registrations: true 
            }
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }
            
        const registration = event.registrations.some(
            (regUser) => regUser.id === user.id
        );


        if (!registration) {
            return res.status(400).json({ 
                success: false, 
                message: "User not registered for this event" 
            });
        }

        await db.event.update({
            where: { id: eventId },
            data: {
                registrations: {
                disconnect: { id: user.id }
        }
      }
    });
        res.status(200).json({ 
            success: true, 
            message: "Registration canceled" 
        });

    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: err.message });
    }
};


const upcomingEvents = async (req, res) => {
    try {
        const now = new Date();

        const events = await db.event.findMany({
            where: {
                dateTime: { gt: now }
            },
            orderBy: [
                { dateTime: "asc" },
                { location: "asc" }
            ]
        });

        res.status(200).json({ 
            success: true, 
            events
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: err.message 
        });
    }
};


const eventStats = async (req, res) => {
    const { eventId } = req.params;

    try {
        const event = await db.event.findUnique({
            where: { 
                id: eventId 
            },
            include: { 
                registrations: true 
            }
        });

        if (!event) {
            return res.status(404).json({ 
                success: false, 
                message: "Event not found" 
            });
        }

        const totalRegistrations = event.registrations.length;
        const remainingCapacity = event.capacity - totalRegistrations;
        const percentageUsed = ((totalRegistrations / event.capacity) * 100).toFixed(2);

        res.status(200).json({
            success: true,
            stats: {
                totalRegistrations,
                remainingCapacity,
                percentageUsed: `${percentageUsed}%`
            }
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: err.message 
        });
    }
}
        
export { createEvent, getEventDetails, registerEvent, cancelRegistration, upcomingEvents, eventStats }