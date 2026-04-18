import Image from "next/image";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import type { IClient } from "@/types";

async function getClients(): Promise<IClient[]> {
  await connectDB();
  const clients = await Client.find().select("name logoUrl").sort({ name: 1 }).lean();
  return JSON.parse(JSON.stringify(clients));
}

export default async function ClientsSection() {
  const clients = await getClients();

  return (
    <section id="clients" className="py-24 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-500">
            Trusted By
          </p>
          <h2 className="text-4xl font-extrabold text-neutral-900 sm:text-5xl">
            Our Client Partners
          </h2>
          <p className="mt-6 mx-auto max-w-xl text-neutral-700">
            Leading Nigerian businesses rely on FAR to deliver the talent that drives their growth.
          </p>
        </div>

        {clients.length === 0 ? (
          <p className="text-center text-sm text-neutral-400">Client logos coming soon.</p>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-8">
            {clients.map((client) => (
              <div
                key={client._id}
                className="flex h-16 w-36 items-center justify-center rounded bg-surface-lowest px-4 border-ghost"
                title={client.name}
              >
                {client.logoUrl ? (
                  <div className="relative h-10 w-28">
                    <Image
                      src={client.logoUrl}
                      alt={client.name}
                      fill
                      className="object-contain"
                      sizes="112px"
                    />
                  </div>
                ) : (
                  <span className="text-sm font-bold text-neutral-600">
                    {client.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
