import React, { Fragment, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import { snakeToCamel } from "./common/functions";

const Profiler = (props) => {
    let { apiToken } = props;
    const [username, setUsername] = useState(props.username);
    const [profile, setProfile] = useState(null);

    const fetchProfile = async (username) => {
        const response = await fetch(`/api/fetch/${username}`),
            profile = await response.json();
        setProfile(
            Object.assign(
                {
                    status: [200, 201].includes(response.status)
                        ? "ok"
                        : "error",
                },
                profile
            )
        );
    };

    useEffect(() => {
        if (props.username) fetchProfile(props.username);
    }, []);

    return (
        <Fragment>
            <form
                className="flex flex-row items-center space-x-2"
                onSubmit={(evt) => {
                    evt.preventDefault();
                    fetchProfile(username);
                }}
            >
                <div>github.com/</div>
                <input
                    onChange={(evt) => setUsername(evt.target.value)}
                    placeholder="username"
                    value={username}
                />
                <input
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                    value="Go"
                />
            </form>
            {profile &&
                {
                    ok: (
                        <div className="flex flex-col items-center space-y-2">
                            <div
                                className={`rounded-md w-[128px] h-[128px] bg-center bg-contain`}
                                style={{
                                    backgroundImage: `url('${profile.avatar_url}')`,
                                }}
                            ></div>
                            <h1 className="font-bold text-lg">
                                {profile.username}
                            </h1>
                            <h2>
                                <span className="text-lg text-yellow-500">
                                    ★
                                </span>
                                {profile.stars}
                            </h2>
                        </div>
                    ),
                    error: (
                        <h2 className="text-lg text-red-500 font-bold">
                            {profile?.message}
                        </h2>
                    ),
                    default: null,
                }[profile?.status ?? "default"]}
        </Fragment>
    );
};

Profiler.propTypes = {};

Array.from(document.querySelectorAll("[data-role=profilerUi]")).forEach(
    (mountPoint) => {
        let props = {};
        Array.from(mountPoint.attributes)
            .filter((node) => node.nodeName.match(/(^data-|^name$|^id$)/))
            .forEach((node) => {
                let data;
                try {
                    data = JSON.parse(node.nodeValue ?? "");
                } catch (e) {
                    data = node.nodeValue;
                }
                props[snakeToCamel(node.nodeName.replace(/^data-/, ""))] = data;
                //if (node.nodeName.match(/^data-/))
                //mountPoint.removeAttribute(node.nodeName);
            });
        if (mountPoint.closest("[data-api_token]")) {
            props[snakeToCamel("api_token")] = mountPoint
                .closest("[data-api_token]")
                .getAttribute("data-api_token");
        }
        createRoot(mountPoint).render(
            <React.StrictMode>
                <Profiler {...props} />
            </React.StrictMode>
        );
    }
);
