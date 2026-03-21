import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export default function TermsPage() {
  return (
    <Providers>
      <Navbar />
      <main className="pt-24 pb-20 px-4 md:px-6 lg:px-12 max-w-4xl mx-auto">
        <article className="prose prose-stone max-w-none font-body">
          <header className="mb-10">
            <span className="inline-flex items-center px-4 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-bold tracking-widest uppercase mb-4">
              Legal
            </span>
            <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-2">
              ข้อกำหนดและเงื่อนไขการใช้งาน
            </h1>
            <p className="text-on-surface-variant text-lg">Terms and Conditions</p>
          </header>

          {/* Section 1 */}
          <section className="bg-surface-container-low p-6 md:p-8 rounded-xl mb-8 space-y-4">
            <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface">1. คำนิยาม (Definitions)</h2>
            <p className="text-on-surface-variant leading-relaxed">
              ในข้อกำหนดและเงื่อนไขฉบับนี้ คำต่อไปนี้มีความหมายดังนี้:
            </p>
            <p className="text-on-surface-variant leading-relaxed italic">
              In these Terms and Conditions, the following terms shall have the meanings set forth below:
            </p>
            <ul className="space-y-4 text-on-surface-variant text-sm leading-relaxed list-none pl-0">
              <li>
                <strong>&quot;แพลตฟอร์ม&quot;</strong> หมายถึง เว็บไซต์ แอปพลิเคชัน และบริการที่เกี่ยวข้องทั้งหมดที่ให้บริการโดย PetHabitat สำหรับการค้นหาสถานที่สำหรับสัตว์เลี้ยงและการลงทะเบียนสัตว์เลี้ยง
                <br /><span className="italic">&quot;Platform&quot; means the website, application, and all related services provided by PetHabitat for finding pet-friendly places and pet registration.</span>
              </li>
              <li>
                <strong>&quot;ผู้ใช้งาน&quot;</strong> หมายถึง บุคคลธรรมดาที่ลงทะเบียนบัญชีและใช้งานแพลตฟอร์ม
                <br /><span className="italic">&quot;User&quot; means any individual who registers an account and uses the Platform.</span>
              </li>
              <li>
                <strong>&quot;สัตว์เลี้ยง&quot;</strong> หมายถึง สัตว์ที่ผู้ใช้งานลงทะเบียนไว้ในแพลตฟอร์ม รวมถึงแต่ไม่จำกัดเพียง สุนัข แมว และสัตว์เลี้ยงอื่น ๆ
                <br /><span className="italic">&quot;Pet&quot; means any animal registered by the User on the Platform, including but not limited to dogs, cats, and other companion animals.</span>
              </li>
              <li>
                <strong>&quot;สถานที่สำหรับสัตว์เลี้ยง&quot;</strong> หมายถึง สถานที่ที่เปิดให้บริการสำหรับสัตว์เลี้ยง ตามที่ลงรายการไว้บนแพลตฟอร์ม เช่น สวนสาธารณะ คาเฟ่ โรงพยาบาลสัตว์ โรงแรมสัตว์เลี้ยง ฯลฯ
                <br /><span className="italic">&quot;Pet-Friendly Place&quot; means any establishment or location listed on the Platform as accepting pets, such as parks, cafes, veterinary clinics, pet hotels, etc.</span>
              </li>
              <li>
                <strong>&quot;เนื้อหา&quot;</strong> หมายถึง ข้อมูล ข้อความ ภาพถ่าย วิดีโอ รีวิว ความคิดเห็น และสื่ออื่น ๆ ที่ผู้ใช้งานหรือบุคคลที่สามอัปโหลดหรือแสดงบนแพลตฟอร์ม
                <br /><span className="italic">&quot;Content&quot; means any information, text, photographs, videos, reviews, comments, and other media uploaded or displayed on the Platform by Users or third parties.</span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="bg-surface-container-low p-6 md:p-8 rounded-xl mb-8 space-y-4">
            <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface">2. การยอมรับข้อกำหนด (Acceptance of Terms)</h2>
            <div className="space-y-4 text-on-surface-variant text-sm leading-relaxed">
              <p>
                <strong>2.1</strong> การเข้าถึงหรือใช้งานแพลตฟอร์มของเรา ถือว่าท่านได้อ่าน เข้าใจ และยอมรับข้อกำหนดและเงื่อนไขเหล่านี้ทั้งหมดแล้ว หากท่านไม่ยอมรับข้อกำหนดเหล่านี้ กรุณาหยุดใช้งานแพลตฟอร์มทันที
              </p>
              <p className="italic">
                By accessing or using our Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions in their entirety. If you do not agree with these Terms, please discontinue use of the Platform immediately.
              </p>
              <p>
                <strong>2.2</strong> เราขอสงวนสิทธิ์ในการแก้ไข เปลี่ยนแปลง หรือปรับปรุงข้อกำหนดเหล่านี้ได้ตลอดเวลา โดยจะแจ้งให้ท่านทราบผ่านแพลตฟอร์มหรืออีเมลล่วงหน้าอย่างน้อย 30 วัน
              </p>
              <p className="italic">
                We reserve the right to modify, amend, or update these Terms at any time. We will notify you via the Platform or email at least 30 days in advance.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-surface-container-low p-6 md:p-8 rounded-xl mb-8 space-y-4">
            <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface">3. คุณสมบัติในการสมัครใช้งาน (Eligibility)</h2>
            <div className="space-y-4 text-on-surface-variant text-sm leading-relaxed">
              <p><strong>3.1</strong> ผู้ใช้งานต้องมีอายุไม่ต่ำกว่า 20 ปีบริบูรณ์ (ตามกฎหมายไทย) หรือได้รับความยินยอมจากผู้ปกครองตามกฎหมาย</p>
              <p className="italic">Users must be at least 20 years of age (legal age under Thai law) or have obtained consent from a legal guardian.</p>
              <p><strong>3.2</strong> ผู้ใช้งานต้องเป็นเจ้าของสัตว์เลี้ยงที่ถูกต้องตามกฎหมาย หรือได้รับมอบอำนาจให้ดูแลสัตว์เลี้ยงที่ลงทะเบียน</p>
              <p className="italic">Users must be the legal owner of the pet(s) registered or be an authorized caretaker.</p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-surface-container-low p-6 md:p-8 rounded-xl mb-8 space-y-4">
            <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface">4. การลงทะเบียนบัญชีผู้ใช้งาน (Account Registration)</h2>
            <div className="space-y-4 text-on-surface-variant text-sm leading-relaxed">
              <p><strong>4.1</strong> เพื่อใช้งานบริการบางส่วน ท่านจำเป็นต้องสร้างบัญชีผู้ใช้งาน โดยต้องให้ข้อมูลที่ถูกต้อง ครบถ้วน และเป็นปัจจุบัน</p>
              <p className="italic">To access certain services, you are required to create a User account by providing accurate, complete, and up-to-date information.</p>
              <p><strong>4.2</strong> ท่านมีหน้าที่รับผิดชอบในการรักษาความลับของรหัสผ่านและข้อมูลบัญชีของท่าน และรับผิดชอบต่อกิจกรรมทั้งหมดที่เกิดขึ้นภายใต้บัญชีของท่าน</p>
              <p className="italic">You are responsible for maintaining the confidentiality of your password and account information, and for all activities that occur under your account.</p>
              <p><strong>4.3</strong> หากท่านพบว่ามีการเข้าถึงบัญชีของท่านโดยไม่ได้รับอนุญาต กรุณาแจ้งให้เราทราบทันที</p>
              <p className="italic">If you suspect unauthorized access to your account, please notify us immediately.</p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-surface-container-low p-6 md:p-8 rounded-xl mb-8 space-y-4">
            <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface">5. การลงทะเบียนสัตว์เลี้ยง (Pet Registration)</h2>
            <div className="space-y-4 text-on-surface-variant text-sm leading-relaxed">
              <p><strong>5.1</strong> ผู้ใช้งานสามารถลงทะเบียนสัตว์เลี้ยงบนแพลตฟอร์มได้ โดยต้องให้ข้อมูลดังต่อไปนี้:</p>
              <p className="italic">Users may register their pets on the Platform by providing the following information:</p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>ชื่อสัตว์เลี้ยง (Pet name)</li>
                <li>ชนิด/สายพันธุ์ (Species/breed)</li>
                <li>อายุ น้ำหนัก และเพศ (Age, weight, and sex)</li>
                <li>ประวัติการฉีดวัคซีน (Vaccination records)</li>
                <li>รูปภาพสัตว์เลี้ยง (Pet photographs)</li>
                <li>ข้อมูลสุขภาพที่เกี่ยวข้อง (Relevant health information)</li>
              </ol>
              <p><strong>5.2</strong> ผู้ใช้งานรับรองว่าข้อมูลสัตว์เลี้ยงที่ให้ไว้ถูกต้องตามความเป็นจริง และจะปรับปรุงข้อมูลให้เป็นปัจจุบันอยู่เสมอ</p>
              <p className="italic">Users warrant that the pet information provided is accurate and agree to keep it updated.</p>
              <p><strong>5.3</strong> แพลตฟอร์มขอสงวนสิทธิ์ในการปฏิเสธหรือลบการลงทะเบียนสัตว์เลี้ยงที่ไม่เป็นไปตามข้อกำหนด</p>
              <p className="italic">The Platform reserves the right to reject or remove pet registrations that do not comply with these Terms.</p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-surface-container-low p-6 md:p-8 rounded-xl mb-8 space-y-4">
            <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface">6. การใช้บริการค้นหาสถานที่ (Place Finder Service)</h2>
            <div className="space-y-4 text-on-surface-variant text-sm leading-relaxed">
              <p><strong>6.1</strong> แพลตฟอร์มให้บริการค้นหาสถานที่ที่เป็นมิตรกับสัตว์เลี้ยง โดยอาศัยข้อมูลจากผู้ประกอบการ ผู้ใช้งาน และแหล่งข้อมูลสาธารณะ</p>
              <p className="italic">The Platform provides a search service for pet-friendly places based on information from operators, users, and public sources.</p>
              <p><strong>6.2</strong> ข้อมูลสถานที่ที่แสดงบนแพลตฟอร์มเป็นข้อมูลเพื่อการอ้างอิงเท่านั้น เราไม่รับประกันความถูกต้อง ความครบถ้วน หรือความเป็นปัจจุบันของข้อมูลดังกล่าว</p>
              <p className="italic">Place information displayed on the Platform is for reference only. We do not guarantee the accuracy, completeness, or currency of such information.</p>
              <p><strong>6.3</strong> ผู้ใช้งานควรตรวจสอบกับสถานที่โดยตรงก่อนเดินทาง โดยเฉพาะเรื่องนโยบายรับสัตว์เลี้ยง เวลาเปิดปิด และข้อจำกัดอื่น ๆ</p>
              <p className="italic">Users should verify directly with the place before visiting, especially regarding pet policies, opening hours, and any restrictions.</p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="bg-surface-container-low p-6 md:p-8 rounded-xl mb-8 space-y-4">
            <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface">7. ข้อจำกัดการใช้งาน (Prohibited Conduct)</h2>
            <p className="text-on-surface-variant text-sm">ผู้ใช้งานตกลงว่าจะไม่กระทำการดังต่อไปนี้: / <span className="italic">Users agree not to engage in the following conduct:</span></p>
            <ol className="list-decimal pl-6 space-y-2 text-on-surface-variant text-sm leading-relaxed">
              <li>ให้ข้อมูลเท็จหรือทำให้เข้าใจผิดเกี่ยวกับตนเองหรือสัตว์เลี้ยงของตน <br /><span className="italic">Providing false or misleading information about themselves or their pets</span></li>
              <li>ใช้แพลตฟอร์มเพื่อวัตถุประสงค์ที่ผิดกฎหมาย รวมถึงการค้าสัตว์ป่าหรือสัตว์ที่ผิดกฎหมาย <br /><span className="italic">Using the Platform for illegal purposes, including illegal wildlife or animal trading</span></li>
              <li>อัปโหลดเนื้อหาที่ไม่เหมาะสม ลามกอนาจาร หรือเป็นการทารุณกรรมสัตว์ <br /><span className="italic">Uploading inappropriate, obscene, or animal cruelty content</span></li>
              <li>พยายามเข้าถึง แฮ็ก หรือรบกวนระบบของแพลตฟอร์ม <br /><span className="italic">Attempting to access, hack, or disrupt the Platform&apos;s systems</span></li>
              <li>ใช้บอท สคริปต์ หรือเครื่องมืออัตโนมัติในการเข้าถึงแพลตฟอร์มโดยไม่ได้รับอนุญาต <br /><span className="italic">Using bots, scripts, or automated tools to access the Platform without authorization</span></li>
              <li>ละเมิดทรัพย์สินทางปัญญาของผู้อื่น <br /><span className="italic">Infringing on the intellectual property rights of others</span></li>
              <li>โพสต์รีวิวเท็จหรือบิดเบือนเพื่อผลประโยชน์ส่วนตัวหรือเพื่อทำลายชื่อเสียงผู้อื่น <br /><span className="italic">Posting false or misleading reviews for personal gain or to damage the reputation of others</span></li>
            </ol>
          </section>

          {/* Section 8 */}
          <section className="bg-surface-container-low p-6 md:p-8 rounded-xl mb-8 space-y-4">
            <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface">8. ทรัพย์สินทางปัญญา (Intellectual Property)</h2>
            <div className="space-y-4 text-on-surface-variant text-sm leading-relaxed">
              <p><strong>8.1</strong> เนื้อหาทั้งหมดบนแพลตฟอร์ม รวมถึงแต่ไม่จำกัดเพียง โลโก้ การออกแบบ ข้อความ กราฟิก และซอฟต์แวร์ เป็นทรัพย์สินของ PetHabitat หรือผู้ให้อนุญาตของเรา</p>
              <p className="italic">All content on the Platform, including but not limited to logos, designs, text, graphics, and software, is the property of PetHabitat or our licensors.</p>
              <p><strong>8.2</strong> เนื้อหาที่ผู้ใช้งานอัปโหลด (เช่น รูปภาพสัตว์เลี้ยง รีวิว) ยังคงเป็นทรัพย์สินของผู้ใช้งาน แต่ท่านให้สิทธิ์ใช้งานแบบไม่จำกัดเฉพาะตัว ไม่สามารถเพิกถอนได้ ปลอดค่าลิขสิทธิ์ และใช้ได้ทั่วโลก แก่เราในการใช้ แสดง และเผยแพร่เนื้อหาดังกล่าวเพื่อวัตถุประสงค์ในการดำเนินงานและการตลาดของแพลตฟอร์ม</p>
              <p className="italic">User-uploaded content (e.g., pet photos, reviews) remains the property of the User. However, you grant us a non-exclusive, irrevocable, royalty-free, worldwide license to use, display, and distribute such content for the Platform&apos;s operational and marketing purposes.</p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="bg-surface-container-low p-6 md:p-8 rounded-xl mb-8 space-y-4">
            <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface">9. ข้อจำกัดความรับผิดชอบ (Limitation of Liability)</h2>
            <div className="space-y-4 text-on-surface-variant text-sm leading-relaxed">
              <p><strong>9.1</strong> แพลตฟอร์มให้บริการบนพื้นฐาน &quot;ตามสภาพ&quot; (as-is) และ &quot;ตามที่มีอยู่&quot; (as-available) เราไม่รับประกันว่าแพลตฟอร์มจะทำงานได้อย่างต่อเนื่อง ปราศจากข้อผิดพลาด หรือปลอดภัยจากไวรัสหรือส่วนประกอบที่เป็นอันตราย</p>
              <p className="italic">The Platform is provided on an &quot;as-is&quot; and &quot;as-available&quot; basis. We make no warranty that the Platform will be uninterrupted, error-free, or free of viruses or harmful components.</p>
              <p><strong>9.2</strong> เราจะไม่รับผิดชอบต่อความเสียหายใด ๆ ที่เกิดจาก: / <span className="italic">We shall not be liable for any damages arising from:</span></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>การกระทำของสัตว์เลี้ยงในสถานที่ใด ๆ / <span className="italic">The actions of pets at any location</span></li>
                <li>ข้อมูลที่ไม่ถูกต้องเกี่ยวกับสถานที่ที่ลงรายการ / <span className="italic">Inaccurate information about listed places</span></li>
                <li>การสูญเสีย บาดเจ็บ หรือเสียหายที่เกิดแก่ผู้ใช้งาน สัตว์เลี้ยง หรือบุคคลที่สาม / <span className="italic">Loss, injury, or damage to Users, pets, or third parties</span></li>
                <li>การหยุดชะงักของบริการอันเนื่องมาจากเหตุสุดวิสัย / <span className="italic">Service interruptions due to force majeure</span></li>
              </ul>
            </div>
          </section>

          {/* Section 10 */}
          <section className="bg-surface-container-low p-6 md:p-8 rounded-xl mb-8 space-y-4">
            <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface">10. การระงับและการยกเลิกบัญชี (Account Suspension and Termination)</h2>
            <div className="space-y-4 text-on-surface-variant text-sm leading-relaxed">
              <p><strong>10.1</strong> เราขอสงวนสิทธิ์ในการระงับหรือยกเลิกบัญชีของท่านได้ตลอดเวลา หากเราพบว่าท่านละเมิดข้อกำหนดเหล่านี้</p>
              <p className="italic">We reserve the right to suspend or terminate your account at any time if we find that you have violated these Terms.</p>
              <p><strong>10.2</strong> ท่านสามารถยกเลิกบัญชีของท่านได้ตลอดเวลาโดยการแจ้งเราผ่านแพลตฟอร์มหรืออีเมล เมื่อยกเลิกบัญชีแล้ว ข้อมูลของท่านจะถูกจัดการตามนโยบายความเป็นส่วนตัวของเรา</p>
              <p className="italic">You may terminate your account at any time by notifying us through the Platform or email. Upon termination, your data will be handled in accordance with our Privacy Policy.</p>
            </div>
          </section>

          {/* Section 11 */}
          <section className="bg-surface-container-low p-6 md:p-8 rounded-xl mb-8 space-y-4">
            <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface">11. กฎหมายที่ใช้บังคับ (Governing Law)</h2>
            <div className="space-y-4 text-on-surface-variant text-sm leading-relaxed">
              <p><strong>11.1</strong> ข้อกำหนดเหล่านี้อยู่ภายใต้กฎหมายแห่งราชอาณาจักรไทย รวมถึงพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) และพระราชบัญญัติว่าด้วยการกระทำความผิดเกี่ยวกับคอมพิวเตอร์ พ.ศ. 2560</p>
              <p className="italic">These Terms shall be governed by the laws of the Kingdom of Thailand, including the Personal Data Protection Act B.E. 2562 (PDPA) and the Computer Crime Act B.E. 2560.</p>
              <p><strong>11.2</strong> ข้อพิพาทใด ๆ ที่เกิดขึ้นจากข้อกำหนดเหล่านี้จะอยู่ภายใต้เขตอำนาจของศาลไทย</p>
              <p className="italic">Any dispute arising from these Terms shall be subject to the jurisdiction of Thai courts.</p>
            </div>
          </section>
        </article>
      </main>
      <Footer />
      <BottomNav />
    </Providers>
  );
}
