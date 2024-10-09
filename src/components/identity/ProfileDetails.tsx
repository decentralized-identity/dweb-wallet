import { Identity } from "@/lib/types";
import { useMemo } from "react";

const ProfileDetails: React.FC<{ identity: Identity }> = ({ identity }) => {

  const bio = useMemo(() => {
    return identity.profile.social?.bio
  }, [ identity ]);

  const apps = useMemo(() => {
    const apps = identity.profile.social?.apps;
    if (!apps || Object.keys(apps).length === 0) {
      return undefined;
    }

    return apps;
  } , [ identity ]);

  return <div className="mt-10 flex flex-wrap justify-center w-full w-9/12 mx-auto text-center">
  <div className="w-full px-4 divide-y-2 divide-dotted divide-slate-300 mb-10">
    <div className="text-xl text-left pl-4">
      About
    </div>
    {bio && <p className="mb-4 px-4 pt-4 text-md text-left leading-relaxed text-slate-600">
      {bio}
    </p> || <p className="pt-4 mb-4 text-sm leading-relaxed text-slate-400 italic">Tell people about yourself</p>}
  </div>
  <div className="w-full px-4 divide-y-2 divide-dotted divide-slate-300">
    <div className="text-xl text-left pl-4">
      Social
    </div>
    {apps && <div className="mb-4 text-md leading-relaxed text-slate-700">
      {apps.facebook && <span className="mr-2">Facebook</span>}
      {apps.twitter && <span className="mr-2">Twitter</span>}
    </div> || <p className="pt-4 mb-4 text-sm leading-relaxed text-slate-400 italic">Add social links</p>}
  </div>
  <div className="w-full px-4 divide-y-2 divide-dotted divide-slate-300">
    <div className="text-xl text-left pl-4">
      Career
    </div>
    <p className="pt-4 mb-4 text-sm leading-relaxed text-slate-400 italic">Where have you worked?</p>
  </div>
</div>;
};

export default ProfileDetails;