import Room from "../models/room";

export const getRoom = async (data: { roomname: string; username: string }) => {
    const sender: string = data.roomname;
    const receiver: string = data.username;

    try {
        const room = await Room.findOne({
            $or: [
                { $and: [{ "user1": receiver }, { "user2": sender}] }, 
                { $and: [{ "user1": sender }, { "user2": receiver}] }
            ]
        });

        if(!room) {
            const newRoom = new Room({
                user1: sender,
                user2: receiver,
            })
            await newRoom.save();

            return newRoom;
        } else {
            return room;
        }
        
    } catch (err) {
        console.log(err);
        return null;
    }
}