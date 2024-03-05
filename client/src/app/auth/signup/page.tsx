'use client'

import useRequest from "@/hooks/useRequest";
import { setCurrentUser } from "@/lib/store/features/currentUser/currentUserSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";


export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const dispatch = useAppDispatch()
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'POST',
    body: { email, password },
    onSuccess: (res) => {
      console.log(res);
      
      dispatch(setCurrentUser(res));
      router.push('/');
    }
  });

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    doRequest();
  }
  return (
    <main className="container">
      <h1>Sign Up</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password" />
        </div>
        {
          errors
        }
        <button className="btn btn-primary">Sign Up</button>
      </form>
    </main>
  );
}