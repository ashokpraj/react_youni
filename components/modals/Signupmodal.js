import NormalUser from "./Normaluser";
import Corporatemodal from "./Corporate";
import { useState } from "react";

const Signupmodal = () => {
  const [removeNormalUser, setRemoveNormalUser] = useState(false);
  const [removeCorporateUser, setRemoveCorporateUser] = useState(false);

  const removeStates = () => {
    setRemoveNormalUser(true);
    setRemoveCorporateUser(false);
  };

  const removeCorporateState = () => {
    setRemoveCorporateUser(true);
    setRemoveNormalUser(false);
  };
  return (
    <>
      <div className="modal-popup-wrapper">
        <div
          className="modal fade modal-form-wrapper signup-form"
          id="signupModalToggle"
          aria-hidden="true"
          aria-labelledby="exampleModalToggleLabel"
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="form-title">Sign Up</h2>
                <span className="form-sub-text">Welcome Let's go Started!</span>
              </div>
              <div className="modal-body">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      name="normal_user"
                      id="normal-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#normal"
                      type="button"
                      role="tab"
                      aria-controls="normal"
                      aria-selected="true"
                      onClick={removeStates}
                    >
                      <span>Normal User</span>
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      name="corporate_user"
                      id="corporate-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#corporate"
                      type="button"
                      role="tab"
                      aria-controls="corporate"
                      aria-selected="false"
                      onClick={removeCorporateState}
                    >
                      <span>Coporate User</span>
                    </button>
                  </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                  <NormalUser removeNormalUser={removeNormalUser} />
                  <Corporatemodal removeCorporateState={removeCorporateUser} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signupmodal;
