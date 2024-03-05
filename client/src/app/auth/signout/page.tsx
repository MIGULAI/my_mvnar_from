'use client'

import useRequest from "@/hooks/useRequest";
import { setCurrentUser } from "@/lib/store/features/currentUser/currentUserSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react"


export default function Page() {
  const router = useRouter();
  const dispatch = useAppDispatch()
  const { doRequest, errors } = useRequest({
    url: '/api/users/signout',
    method: 'POST',
    body: {},
    onSuccess: () => {
      router.push('/')
      dispatch(setCurrentUser(null));
    }
  });

  useEffect(() => {
    doRequest()
  }, []);// eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
    </>
  )
}