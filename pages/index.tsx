import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";
import handler from "./api/createRoom";
import { useState } from "react";
import { request } from "http";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [name, setName] = useState("");
  const req = {
    roomName: name,
  };
  const createRoom = async(req:any) => {
    const { roomName, privacy, expiryMinutes, ...rest } = req;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 46914bcfae379be9ae3a647dd9d7655e0503301cf36c9b5b64404fdce004db82`,
      },
      body: JSON.stringify({
        privacy: privacy || "public",
        properties: {
          exp: Math.round(Date.now() / 1000) + (expiryMinutes || 5) * 60, // expire in x minutes
          eject_at_room_exp: true,
          enable_knocking: privacy !== "public",
          ...rest,
        },
      }),
    };

    const dailyRes:any = await fetch(
      `${process.env.DAILY_REST_DOMAIN || "https://api.daily.co/v1"}/rooms`,
      options
    );
    const { name, url, error } = await dailyRes.json(); 
    getRoom(name)
  }
  const getRoom = async (name:any) => {
    const res = await fetch(`https://api.daily.co/v1/rooms/${name}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 46914bcfae379be9ae3a647dd9d7655e0503301cf36c9b5b64404fdce004db82`,
      }
    });
    if(res?.url){
      window.open(`https://butter.daily.co/${name}`, "_blank");
    }
  };
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <button
        onClick={() => createRoom(req)}
        className="px-3 text-xl bg-indigo-500 rounded-lg"
      >
        Create Room
      </button>
    </main>
  );
}
