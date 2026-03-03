import Link from "next/link";

export default function TopBar({
  title = "AlmostCrackd",
  tag = "hw5",
  status,
}: {
  title?: string;
  tag?: string;
  status?: { ok: boolean; text: string };
}) {
  return (
    <div className="topbar">
      <div className="brand">
        <span className="badge" />
        <span>{title}</span>
        <span className="kbd">{tag}</span>
      </div>

      <div className="row" style={{ marginTop: 0 }}>
        <Link className="btn btnGhost" href="/">Home</Link>
        <Link className="btn btnGhost" href="/captions">Captions</Link>
        <Link className="btn btnGhost" href="/list">List</Link>
        <Link className="btn btnGhost" href="/protected">Protected</Link>
        <Link className="btn" href="/logout">Logout</Link>
        {status && (
          <span className="pill" style={{ marginLeft: 4 }}>
            <span className={`dot ${status.ok ? "ok" : "no"}`} />
            {status.text}
          </span>
        )}
      </div>
    </div>
  );
}