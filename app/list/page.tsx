import { supabase } from "@/lib/supabaseClient";

type Row = Record<string, any>;

export default async function ListPage() {
  const { data, error } = await supabase
    .from("humor_flavors")
    .select("*")
    .limit(50);

  if (error) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Humor Flavors</h1>
        <p style={{ color: "crimson" }}>Error: {error.message}</p>
      </main>
    );
  }

  const rows: Row[] = data ?? [];

  return (
    <main style={{ padding: 24 }}>
      <h1>Humor Flavors</h1>

      {rows.length === 0 ? (
        <p>No rows found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                {Object.keys(rows[0]).map((k) => (
                  <th
                    key={k}
                    style={{
                      textAlign: "left",
                      padding: 8,
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {k}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id ?? i}>
                  {Object.keys(rows[0]).map((k) => (
                    <td
                      key={k}
                      style={{
                        padding: 8,
                        borderBottom: "1px solid #f0f0f0",
                        verticalAlign: "top",
                      }}
                    >
                      {typeof row[k] === "object"
                        ? JSON.stringify(row[k])
                        : String(row[k])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
