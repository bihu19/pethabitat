"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import type { Pet, MedicalRecord } from "@/lib/types";

export default function MedicalContent({ petId }: { petId: string }) {
  const { t } = useI18n();
  const router = useRouter();
  const [pet, setPet] = useState<Pet | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    record_type: "vaccination" as MedicalRecord["record_type"],
    description: "",
    date: new Date().toISOString().split("T")[0],
    next_due_date: "",
    veterinarian: "",
    clinic: "",
    status: "completed" as MedicalRecord["status"],
  });

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: petData } = await supabase.from("pets").select("*").eq("id", petId).single();
      setPet(petData);

      const { data: recordsData } = await supabase
        .from("medical_records")
        .select("*")
        .eq("pet_id", petId)
        .order("date", { ascending: false });
      setRecords(recordsData || []);
      setLoading(false);
    }
    load();
  }, [petId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("medical_records")
        .insert({
          pet_id: petId,
          ...form,
          next_due_date: form.next_due_date || null,
          veterinarian: form.veterinarian || null,
          clinic: form.clinic || null,
          description: form.description || null,
        })
        .select()
        .single();
      if (error) throw error;
      setRecords([data, ...records]);
      setShowForm(false);
      setForm({
        title: "", record_type: "vaccination", description: "",
        date: new Date().toISOString().split("T")[0], next_due_date: "",
        veterinarian: "", clinic: "", status: "completed",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add record");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this record?")) return;
    await supabase.from("medical_records").delete().eq("id", id);
    setRecords(records.filter((r) => r.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
      </div>
    );
  }

  const completed = records.filter((r) => r.status === "completed").length;
  const upcoming = records.filter((r) => r.status === "upcoming").length;
  const overdue = records.filter((r) => r.status === "overdue").length;
  const nextDue = records.find((r) => r.status === "upcoming");

  return (
    <>
      <header className="mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-on-surface-variant hover:text-primary mb-4">
          <span className="material-symbols-outlined">arrow_back</span> {t("common.back")}
        </button>
        <nav className="text-sm text-stone-400 mb-2 flex gap-2">
          <span>{pet?.name}</span> <span>/</span> <span className="text-stone-600">{t("medical.title")}</span>
        </nav>
        <div className="flex justify-between items-end">
          <h1 className="text-3xl md:text-4xl font-headline font-extrabold text-on-surface tracking-tight">
            {t("medical.vaccinations")}
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-full font-bold flex items-center gap-2 text-sm"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            {t("medical.addRecord")}
          </button>
        </div>
      </header>

      {/* Summary cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
        <div className="bg-surface-container-low p-6 md:p-8 rounded-xl relative overflow-hidden">
          <p className="text-stone-500 font-medium mb-1">{t("medical.nextDue")}</p>
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-2">
            {nextDue ? new Date(nextDue.next_due_date || nextDue.date).toLocaleDateString() : "N/A"}
          </h2>
          {nextDue && (
            <span className="bg-surface-container-lowest/60 px-3 py-1 rounded-full text-sm font-semibold">{nextDue.title}</span>
          )}
        </div>
        <div className="bg-secondary-container p-6 md:p-8 rounded-xl">
          <p className="text-on-secondary-container/70 font-medium mb-1">{t("medical.overallStatus")}</p>
          <h2 className="text-xl md:text-2xl font-bold text-on-secondary-container">
            {overdue > 0 ? `${overdue} Overdue` : t("common.healthy")}
          </h2>
          <p className="text-sm text-on-secondary-container/80 mt-2">{completed} {t("medical.completed")}</p>
        </div>
        <div className="bg-tertiary-container p-6 md:p-8 rounded-xl text-on-tertiary-container text-center flex flex-col items-center justify-center">
          <span className="material-symbols-outlined text-3xl mb-2">file_download</span>
          <p className="font-bold">{t("medical.exportPassport")}</p>
        </div>
      </section>

      {/* Add record form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-surface-container-low p-6 md:p-8 rounded-xl mb-8 space-y-4">
          <h3 className="font-headline font-bold text-lg">{t("medical.addRecord")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-on-surface-variant">Title</label>
              <input className="h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-on-surface-variant">Type</label>
              <select className="h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary" value={form.record_type} onChange={(e) => setForm({ ...form, record_type: e.target.value as any })}>
                <option value="vaccination">Vaccination</option>
                <option value="checkup">Checkup</option>
                <option value="medication">Medication</option>
                <option value="surgery">Surgery</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-on-surface-variant">Date</label>
              <input type="date" className="h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-on-surface-variant">Next Due Date</label>
              <input type="date" className="h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary" value={form.next_due_date} onChange={(e) => setForm({ ...form, next_due_date: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-on-surface-variant">Veterinarian</label>
              <input className="h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary" value={form.veterinarian} onChange={(e) => setForm({ ...form, veterinarian: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-on-surface-variant">Clinic</label>
              <input className="h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary" value={form.clinic} onChange={(e) => setForm({ ...form, clinic: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-on-surface-variant">Status</label>
              <select className="h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}>
                <option value="completed">{t("medical.completed")}</option>
                <option value="upcoming">{t("medical.upcoming")}</option>
                <option value="overdue">{t("medical.overdue")}</option>
              </select>
            </div>
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-bold text-on-surface-variant">Description</label>
              <textarea className="p-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary resize-none" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 rounded-full font-bold text-on-surface-variant">{t("pet.cancel")}</button>
            <button type="submit" disabled={submitting} className="px-8 py-2 rounded-full font-bold bg-primary text-on-primary disabled:opacity-50">
              {submitting ? t("common.loading") : t("common.save")}
            </button>
          </div>
        </form>
      )}

      {/* Timeline */}
      <section className="space-y-6">
        <h3 className="text-xl md:text-2xl font-bold text-on-surface flex items-center gap-3">
          Current Timeline <span className="h-px flex-1 bg-outline-variant/30"></span>
        </h3>
        <div className="relative space-y-6 pl-12 md:pl-16">
          <div className="absolute left-5 md:left-[1.65rem] top-0 bottom-0 w-px bg-outline-variant/30"></div>

          {records.map((record) => (
            <div key={record.id} className="relative flex gap-4 md:gap-8 items-start group">
              <div className={`absolute left-[-1.75rem] md:left-[-2.35rem] z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ring-4 md:ring-8 ring-background shadow-lg ${
                record.status === "overdue" ? "bg-error-container text-error" :
                record.status === "upcoming" ? "bg-surface-container-highest text-stone-400" :
                "bg-secondary text-on-secondary"
              }`}>
                <span className="material-symbols-outlined text-sm md:text-base" style={record.status === "completed" ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                  {record.status === "overdue" ? "warning" : record.status === "upcoming" ? "schedule" : "check_circle"}
                </span>
              </div>
              <div className={`flex-1 bg-surface-container-low p-4 md:p-6 rounded-lg border-l-4 ${
                record.status === "overdue" ? "border-error" :
                record.status === "upcoming" ? "border-primary-container" :
                "border-secondary"
              } hover:shadow-md transition-all`}>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="text-base md:text-lg font-bold text-on-surface">{record.title}</h4>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        record.status === "overdue" ? "bg-error-container text-error" :
                        record.status === "upcoming" ? "bg-primary-container/20 text-on-primary-container" :
                        "bg-secondary-container text-on-secondary-container"
                      }`}>
                        {t(`medical.${record.status}`)}
                      </span>
                    </div>
                    <p className="text-stone-500 font-medium text-sm">
                      {new Date(record.date).toLocaleDateString()}
                      {record.veterinarian && ` • ${record.veterinarian}`}
                      {record.clinic && ` • ${record.clinic}`}
                    </p>
                    {record.description && <p className="text-sm text-on-surface-variant mt-2">{record.description}</p>}
                  </div>
                  <button onClick={() => handleDelete(record.id)} className="p-1 text-stone-400 hover:text-error transition-colors">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {records.length === 0 && (
            <div className="text-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2">vaccines</span>
              <p>No medical records yet. Add your first record!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
