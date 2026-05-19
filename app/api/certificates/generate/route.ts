import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { generateCertificate } from '@/lib/pdf-generator';

export async function POST(req: Request) {
  try {
    const { courseId, courseName } = await req.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }



    // If all completed, generate PDF
    const pdfBytes = await generateCertificate(
      user.user_metadata.full_name || user.email,
      courseName,
      new Date().toLocaleDateString()
    );

    // Upload to Supabase Storage
    const fileName = `certificates/${user.id}_${courseId}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from('certificates')
      .upload(fileName, pdfBytes, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('certificates')
      .getPublicUrl(fileName);

    // Save to certificates table
    await supabase.from('certificates').insert({
      user_id: user.id,
      course_id: courseId,
      pdf_url: publicUrl,
    });

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('CERTIFICATE_ERROR', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
