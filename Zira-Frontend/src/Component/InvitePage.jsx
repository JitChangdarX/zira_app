import React from "react";
import { useParams, useSearchParams } from "react-router-dom";

export default function InvitePage() {
  // route param
  const { inviteId } = useParams();
  
  // query param
  const [searchParams] = useSearchParams();

  const authToken = searchParams.get("auth_token");

  return (
    <div>
      <h2>Invite Page</h2>

      <h3>Invite Id:</h3>
      <p>{inviteId}</p>

      <h3>Auth Token:</h3>
      <p>{authToken}</p>
    </div>
  );
}
