import { useState, useEffect, useContext } from 'react';

import CommentList from './comment-list';
import NewComment from './new-comment';
import classes from './comments.module.css';
import NotificationContext from '../../store/notification-context';

function Comments(props) {
  const { eventId } = props;

  const [showComments, setShowComments] = useState(false);
  const [commentList, setCommentList] = useState([])
  const notificationCtx = useContext(NotificationContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showComments) {
      setIsLoading(true)
      fetch(`/api/comments/${eventId}`)
      .then((response) => response.json())
      .then((data) => setCommentList(data.comments))
    }
    setIsLoading(false);
  }, [showComments])

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus);
  }

  function addCommentHandler(commentData) {
    notificationCtx.showNotification({
      title: 'Making a comment',
      message: 'Making a new comment',
      status: 'pending'
    })

    // send data to API
    fetch(`/api/comments/${eventId}`, {
      method: 'POST',
      body: JSON.stringify(commentData),
      headers: {
        'Content-type': 'application/json'
      }
    })
    .then((response) => {
      if(response.ok) {
        return response.json()
      }
      return response.json().then((data) => {
        throw new Error(data.message || 'Something wennt')
      })
    })
     .then((data) => {
       notificationCtx.showNotification({
         title: 'Success',
         message: 'Sent',
         status: 'success'
       })
     })
     .catch(error => {
       notificationCtx.showNotification({
         title: 'Error!',
         message: error.message || 'Something went wrong',
         status: 'error'
       })
     })

  }

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? 'Hide' : 'Show'} Comments
      </button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && !isLoading && <CommentList comments={commentList} />} 
      {showComments && isLoading && <p>Loading...</p>}
    </section>
  );
}

export default Comments;
