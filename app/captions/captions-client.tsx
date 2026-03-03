"use client";

import { useState } from "react";
import Link from "next/link";
import CaptionCards from "./CaptionCards";

type Caption = {
  id: string;
  content: string;
  like_count: number;
};

export default function CaptionsClient() {
  const [captions, setCaptions] = useState<Caption[]>([]);

  return (
    <div className="card">
      <div className="header">
        <div className="brand">
          <span className="badge" />
          <span>AlmostCrackd</span>
          <span className="kbd">captions</span>
        </div>

        <div className="row">
          <Link className="btn" href="/">Home</Link>
          <Link className="btn" href="/logout">Logout</Link>
        </div>
      </div>

      <div className="main">
        <h1 className="h1" style={{ fontSize: 28 }}>Generate captions</h1>
        <p className="p">Upload an image to run the pipeline. Then vote on the results.</p>


        {captions.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <CaptionCards captions={captions} />
          </div>
        )}
      </div>
    </div>
  );
}