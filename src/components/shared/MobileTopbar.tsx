import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutation";

function MobileTopbar() {
  const navigate = useNavigate();

  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const { user } = useAuthContext();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/inst.svg"
            alt="logo"
            width={35}
            height={35}
          />
          <p className="h3-bold text-slate-100">Post Gram</p>
        </Link>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}
          >
            <img src="/icons/logout.svg" alt="logout" />
          </Button>
          {/* <Link to={`/profile/${user.id}`} className="flex-center gap-3"> */}
          <div className="flex-center gap-3">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </div>
          {/* </Link> */}
        </div>
      </div>
    </section>
  );
}

export default MobileTopbar;
