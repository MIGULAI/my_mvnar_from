import { useState } from "react";


type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

type RequestConfig = {
  url: string;
  method: Method;
  body?: any;
  onSuccess?: (response?:any) => void;
}

export default function useRequest({url, method, body, onSuccess}:RequestConfig) {
  const [errors, setErrors] = useState(<></>);

  const doRequest = async () => {
    try {
      setErrors(<></>);
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        const result = await response.json();
        
        onSuccess && onSuccess(result);
      } else {
        const result = await response.json();
        setErrors(
          <div className="alert alert-danger">
            <h4>Ooops...</h4>
            <ul className="my-0">
              {
                result.errors.map((err: any, i: number) => (
                  <li key={i}>{err.message}</li>
                ))
              }
            </ul>
          </div>
        );
      }
    } catch (err) {
      console.error('Failed to sign up');
    }
  };

  return { doRequest, errors };
}