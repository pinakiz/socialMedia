import User from "../models/User.js";


/* Read */
export const getUser = async (req , res)=>{
    try{
        const {id} = req.params;
        const user = await User.findById(id);
        return res.status(200).json(user);


    }catch(err){
        return res.status(404).json({message : err.message});
    }
}

export const getUserFriends = async (req , res)=>{
    try{
        const {id} = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map((id)=>User.findById(id))
        );
        const formattedFriends = friends.map(
            (
                ({_id , firstName , lastName , occupation , location , picturePath })=>{
                    return {_id , firstName , lastName , occupation , location , picturePath }
                }
            )
        );
        res.status(200).json(formattedFriends);

    }catch(err){
        return res.status(404).json({message : err.message});
    }
}

/* ADD REMOVE FRIEND */
export const addRemoveFriend = async (req , res)=>{
    try{
        const {id , friendId} = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if(user.friends.includes(friendId)){
            user.friends = user.friends.filter((id)!== friendId);
            friend.friends = friend.friends.filter((id)!=id);
        }
        else{
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id)=>User.findById(id))
        );
        const formattedFriends = friends.map(
            (
                ({_id , firstName , lastName , occupation , location , picturePath })=>{
                    return {_id , firstName , lastName , occupation , location , picturePath }
                }
            )
        );
        res.status(200).json(formattedFriends);

    }catch(err){
        return res.status(404).json({message : err.message});
    }
}