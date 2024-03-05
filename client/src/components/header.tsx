'use client'
import { RootState } from "@/lib/store/store";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

export default function Header() {
  const currentUser = useSelector((state: RootState) => state.currentUser.currentUser);

  const links = [
    !currentUser && {
      label: "Sign in", href: "/auth/signin"
    },
    !currentUser && {
      label: "Sign up", href: "/auth/signup"
    },
    currentUser && {
      label: "Sign out", href: "/auth/signout"
    }
  ]

  return (
    <nav className="navbar navbor-light bg-light">
      <Link href={'/'} className="navbar-brand">
        Home
      </Link>
      <div className="d-flex justify-cintent-end">
        <ul className="nav d-flex align-items-center">
          {
            links.map((link, index) => {
              if (link) {
                return (
                  <li key={index} className="nav-item">
                    <Link href={link.href}  className="nav-link">
                      {link.label}
                    </Link>
                  </li>
                )
              }
            })
          }
        </ul>
      </div>
    </nav>
  );
}