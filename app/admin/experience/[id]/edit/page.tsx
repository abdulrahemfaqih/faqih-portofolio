import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ExperienceForm from "@/components/admin/ExperienceForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminExperienceEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: experience, error } = await supabase
    .from("experience")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !experience) {
    notFound();
  }

  return <ExperienceForm initialData={experience} />;
}
