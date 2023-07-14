import React from "react";

function RestrictedPage() {
  return (
    <>
      <div className="vh-100 vw-100 d-flex justify-content-center align-items-center p-2">
        <strong>Restricted For Below 767px Screen Resolutions</strong>
      </div>
    </>
  );
}

export default RestrictedPage;
