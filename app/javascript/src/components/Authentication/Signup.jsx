import React, { useState } from "react";

import SignupForm from "components/Authentication/Form/SignupForm";
import authApi from "apis/auth";

const Signup = ({ history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      console.log("1");
      setLoading(true);
      console.log("2");
      //const response = await authApi.login({ login: { email, password } });
      await authApi.signup({
        user: {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation
        }
      });
      console.log("3");
      setLoading(false);
      history.push("/");
    } catch (error) {
      setLoading(false);
      logger.error(error);
    }
  };
  return (
    <SignupForm
      setName={setName}
      setEmail={setEmail}
      setPassword={setPassword}
      setPasswordConfirmation={setPasswordConfirmation}
      loading={loading}
      handleSubmit={handleSubmit}
    />
  );
};

export default Signup;
