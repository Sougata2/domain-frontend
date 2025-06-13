import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import CryptoJS from "crypto-js";
import oauthConfig from "../../google_oauth.json";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      console.log("Authorization Code: ", code);
      // exchangedCodeForToken(code);
      (async () => {
        try {
          const response = await fetch(
            "http://localhost:8080/domain/oauth/access-token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ code: code }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            const accessToken = data.access_token;

            const userInfoResponse = await fetch(
              "http://localhost:8080/domain/oauth/user-info",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ access_token: accessToken }),
              }
            );

            if (userInfoResponse.ok) {
              const userInfo = await userInfoResponse.json();
              console.log(userInfo);
            }
          }
        } catch (e) {
          console.log(e);
        }
      })();

      // TODO: HANDLE THE REQUEST IN THE BACKEND.
      // async function exchangedCodeForToken(code) {
      //   try {
      //     const response = await fetch(oauthConfig.web.token_uri, {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/x-www-form-urlencoded",
      //       },
      //       body: new URLSearchParams({
      //         code: code,
      //         client_id: oauthConfig.web.client_id,
      //         client_secret: oauthConfig.web.client_secret,
      //         redirect_uri: oauthConfig.web.redirect_uris[0],
      //         grant_type: "authorization_code",
      //       }),
      //     });

      //     const data = await response.json();

      //     if (data.access_token) {
      //       // Fetch user info using the access token
      //       fetchUserInfo(data.access_token);
      //     }
      //   } catch (error) {
      //     console.error("Error exchanging code for token:", error);
      //   }
      // }
    }
  }, [searchParams]);

  // TODO: HANDLE THE REQUEST IN THE BACKEND.
  // async function fetchUserInfo(accessToken) {
  //   try {
  //     const response = await fetch(
  //       "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );

  //     const userInfo = await response.json();
  //     console.log("User Info: ", userInfo);
  //   } catch (error) {
  //     console.error("Error fetching user info:", error);
  //   }
  // }

  function onChange(e) {
    const { name, value } = e.target;
    setData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();

    // encrypt the password for security.
    const SECRET_KEY = CryptoJS.enc.Utf8.parse(
      import.meta.env.VITE_AES_SECRET_KEY
    );

    const _ = CryptoJS.AES.encrypt(data.password, SECRET_KEY, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();

    try {
      const response = await axios.post("/auth/login", data);
      Cookies.set("Authorization", `Bearer ${response.data.token}`);
      console.log(response);
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  }

  async function handleGoogleAuthRequest() {
    // initial request to access the code from Google.
    const scope =
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";

    const oauthUrl = `${oauthConfig.web.auth_uri}?client_id=${
      import.meta.env.VITE_GOOGLE_CLIENT_ID
    }&redirect_uri=${
      oauthConfig.web.redirect_uris[0]
    }&response_type=code&scope=${encodeURIComponent(
      scope
    )}&include_granted_scopes=true`;

    // had to do this fetch was giving cors error and there is no way
    // change that
    window.location.href = oauthUrl;
  }

  return (
    <div
      className={"flex flex-col gap-3.5 justify-center items-center h-screen"}
    >
      <form className={"flex flex-col gap-2.5"} onSubmit={onSubmit}>
        <div className={"flex flex-col gap-2.5"}>
          <Label htmlFor={"email"} id={"email"}>
            Email
          </Label>
          <Input
            placeholder={"Email"}
            name={"username"}
            value={data.username}
            onChange={onChange}
          />
        </div>
        <div className={"flex flex-col gap-2.5"}>
          <Label htmlFor={"pasword"} id={"password"}>
            Password
          </Label>
          <Input
            placeholder={"Password"}
            name={"password"}
            value={data.password}
            onChange={onChange}
          />
        </div>
        <Button>Login</Button>
      </form>
      <Button
        onClick={handleGoogleAuthRequest}
        className={"bg-red-400 hover:bg-red-500"}
      >
        Google
      </Button>
    </div>
  );
}
