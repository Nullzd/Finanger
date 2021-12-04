const session = {
  id: 0,
  username: null,
  isAuth: false,
  lastLogin: null,
};

export default session;

// const [session, setSession] = useLocalStorage("session", userdata);

{
  /* <div>
<h5>Teste</h5>
<h6>
  ID: {session.id} Name:{session.username}
</h6>
<button
  onClick={() => {
    setSession((prev) => {
      return { ...prev, id: 7, username: "carl" };
    });
  }}
>
  Change User
</button>
<button
  onClick={() => {
    setSession(userdata);
  }}
>
  Clear User
</button>
</div> */
}
