import axios from "axios";
import { cookies } from "next/headers";

export default function apiClient () {
  if (typeof window === 'undefined') {
    const cookie = cookies().get('session');
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: {
        'Host': 'ticketing.dev',
        'Cookie': "session="+cookie?.value+";",
      }
    });
  } else {
    return axios.create({
      baseURL: '/'
    });
  }
}