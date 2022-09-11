import React, { useEffect, useState } from 'react'
import './FeedCard.css'
import feed_avatar from '../../assets/images/avatar2.png'
import heart_outlined from '../../assets/icons/heart_outlined.png'
import heart_filled from '../../assets/icons/heart_filled.png'
import Axios from 'axios';
import { Chips } from '../../components/Chips/Chips'
import random from 'random-string-generator';
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

export const FeedCard = ({ post, recall }) => {
    const navigate = useNavigate();
    const username = JSON.parse(localStorage.getItem("user_info")).username;
    const fullname = JSON.parse(localStorage.getItem("user_info")).fullname;
    const userspace = JSON.parse(localStorage.getItem("user_spaces"));
    console.log(userspace);
    //check if user has liked the post in array of objects
    // const liked = post.likes.some(like => like.username === username);
    const obj = {
        id: post._id,
        username: username
    }

    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes.length);
    useEffect(() => {
        if (post.likes.some(like => like.username === username)) {
            setLiked(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    const [postUser,setPostUser] =useState({});
    useEffect(() => {
        console.log(post.username);
        const setUserDetails = async () => {
            const res = await Axios.post("https://devmeet-server.herokuapp.com/getUser", { username: post.username });
            console.log(res.data);
            setPostUser(res.data);
            // localStorage.setItem('user_info', JSON.stringify(res.data));
        }
        setUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recall]);


    const handleLike = () => {
        if (liked) {
            return;
        }
        // console.log(randomstring.generate(7));
        Axios.post("https://devmeet-server.herokuapp.com/post-like", obj).then((res) => {
            console.log(res.data.message);
            setLiked(true);
            setLikeCount(likeCount + 1);
        })
    }

    const handleDislike = () => {
        if (!liked) {
            return;
        }
        // console.log("dislike clicked!")
        Axios.post("https://devmeet-server.herokuapp.com/post-dislike", obj).then((res) => {
            console.log(res.data.message);
            setLiked(false);
            setLikeCount(likeCount - 1);
        })
    }

    const deletePost = () => {
        Axios.post(`https://devmeet-server.herokuapp.com/delete-post/${post._id}`).then((res) => {
            console.log(res.data.message);
            window.location.reload()
        })
    }

    function userAlreadyConnected(postUsername) {
        //iterate userspace
        for (let i = 0; i < userspace.length; i++) {
            //if user is in userspace
            if (userspace[i].members[1] === postUsername) {
                return true;
            }
        }
        return false;
    }

    async function handleConnect(postUsername) {
        if (userAlreadyConnected(postUsername)) {
            alert("User already connected!");
            navigate("/messages");
            return;
        }
        console.log('Creating spaces');
        const admin = username;
        const spaceName = random();
        const members = [username, postUsername];

        const obj = {
            admin: admin,
            spaceName: spaceName,
            members: members,
            chatPic : postUser.profilePic
        }

        const res = await Axios.post("https://devmeet-server.herokuapp.com/create-space", obj);
        console.log(res.data.message);
        const sendMessage = await Axios.post("https://devmeet-server.herokuapp.com/send-email", { email: post.email, name: fullname });
        console.log(sendMessage.data.message);
        navigate("/messages");
      }
    
    console.log(post)
    return <div className='feed-card-con'>
        {post.username === username ? <div className="delete-con" onClick={deletePost}></div>: null}
        
        <div className="left">
            <img src={postUser.profilePic?postUser.profilePic:feed_avatar} alt="Avatar" className='feed_avatar' />
        </div>
        <div className="right">
            <p className='feed-name'>{post.name}</p>
            <p className='feed-time'>{moment(post.date).format('LLL')}</p>
            <div className="proj-desc">
                <p className='feed-title'>{post.title}</p>
                <div className="skillss-con">
                    <p>Skills Required: </p>
                    {post.skills.map((skill, idx) => {
                        return <Chips className="feed-skill" name={skill} key={idx} />
                    })}
                </div>
                <p className="yoe">Year of Education: {post.year}</p>
            </div>
            <div className="bottom-con">
                {post.username!==username?<div className="connect-btn" onClick={()=>handleConnect(post.username)}>
                    <p>Connect</p>
                </div>: <div></div>}
                
                <div className="like-con">
                    {liked ? <img src={heart_filled} alt="liked" onClick={handleDislike}/>: <img src={heart_outlined} alt="not liked" onClick={handleLike} />}
                    <p className='likes'>{post.likes? likeCount: 0}</p>
                </div>
            </div>
        </div>
    </div>
}
