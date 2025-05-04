"use client"
import { useEffect, useState } from "react";

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const collectUserInfo = () => {
      const ipAddress = "Not Available"; // You can fetch this from an external API
      const browserInfo = navigator.userAgent;
      const deviceInfo = window.innerWidth > 768 ? "Desktop" : "Mobile";
      const osInfo = navigator.platform;
      const screenResolution = `${window.screen.width}x${window.screen.height}`;
      const language = navigator.language;
      const location = "Not Available"; // GeoIP or Geolocation API can be used
      const referrer = document.referrer;
      const visitedPages = window.location.pathname;
      const timeOnSite = Math.round(window.performance.timing.loadEventEnd / 1000);
      const clicksAndEvents = "Tracking clicks here...";

      setUserInfo({
        ipAddress,
        browserInfo,
        deviceInfo,
        osInfo,
        screenResolution,
        language,
        location,
        referrer,
        visitedPages,
        timeOnSite,
        clicksAndEvents,
      });
    };

    collectUserInfo();
  }, []);

  return (
    <div className="text-white">
      <h2>User Information</h2>
      <pre>{JSON.stringify(userInfo, null, 2)}</pre>
    </div>
  );
};

export default UserInfo;
