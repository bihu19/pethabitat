import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export default function PrivacyPage() {
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
              นโยบายความเป็นส่วนตัว
            </h1>
            <p className="text-on-surface-variant text-lg">Privacy Policy</p>
            <p className="text-on-surface-variant text-sm mt-2">
              นโยบายความเป็นส่วนตัวฉบับนี้จัดทำขึ้นตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
            </p>
            <p className="text-on-surface-variant text-sm italic">
              This Privacy Policy is prepared in accordance with the Personal Data Protection Act B.E. 2562 (PDPA) to explain how we collect, use, disclose, and protect your personal data.
            </p>
          </header>

          {/* Section 12 */}
          <section className="bg-surface-container-low p-6 md:p-8 rounded-xl mb-8 space-y-4">
            <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface">12. ผู้ควบคุมข้อมูลส่วนบุคคล (Data Controller)</h2>
            <div className="text-on-surface-variant text-sm leading-relaxed space-y-1">
              <p><strong>PetHabitat</strong></p>
              <p>อีเมล / Email: contact@pethabitat.com</p>
            </div>
          </section>

          {/* Section 13 */}
          <section className="bg-surface-container-low p-6 md:p-8 rounded-xl mb-8 space-y-4">
            <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface">13. ข้อมูลส่วนบุคคลที่เราเก็บรวบรวม (Personal Data We Collect)</h2>

            <h3 className="font-headline font-bold text-base text-on-surface">13.1 ข้อมูลที่ท่านให้โดยตรง (Data Provided Directly by You)</h3>
            <ol className="list-decimal pl-6 space-y-1 text-on-surface-variant text-sm">
              <li>ชื่อ นามสกุล (Full name)</li>
              <li>อีเมล (Email address)</li>
              <li>หมายเลขโทรศัพท์ (Phone number)</li>
              <li>ที่อยู่ / พื้นที่อยู่อาศัย (Address / residential area)</li>
              <li>รูปภาพโปรไฟล์ (Profile photo)</li>
              <li>ข้อมูลบัญชี Social Media (หากสมัครผ่าน Social Login) / Social media account data (if using Social Login)</li>
            </ol>

            <h3 className="font-headline font-bold text-base text-on-surface">13.2 ข้อมูลสัตว์เลี้ยง (Pet Data)</h3>
            <ol className="list-decimal pl-6 space-y-1 text-on-surface-variant text-sm">
              <li>ชื่อ ชนิด สายพันธุ์ อายุ เพศ น้ำหนัก / Name, species, breed, age, sex, weight</li>
              <li>ประวัติการฉีดวัคซีนและสุขภาพ / Vaccination and health records</li>
              <li>รูปภาพสัตว์เลี้ยง / Pet photographs</li>
              <li>หมายเลขไมโครชิป (ถ้ามี) / Microchip number (if any)</li>
              <li>พฤติกรรมพิเศษหรือข้อจำกัด / Special behavior or restrictions</li>
            </ol>

            <h3 className="font-headline font-bold text-base text-on-surface">13.3 ข้อมูลที่เก็บโดยอัตโนมัติ (Automatically Collected Data)</h3>
            <ol className="list-decimal pl-6 space-y-1 text-on-surface-variant text-sm">
              <li>ข้อมูลตำแหน่งที่ตั้ง (Geolocation data) เพื่อค้นหาสถานที่ใกล้เคียง</li>
              <li>ข้อมูลอุปกรณ์ (Device information): ประเภทอุปกรณ์, ระบบปฏิบัติการ, เวอร์ชันเบราว์เซอร์</li>
              <li>ข้อมูลการใช้งาน (Usage data): หน้าที่เข้าชม, ระยะเวลาการใช้งาน, รูปแบบการค้นหา</li>
              <li>ข้อมูลคุกกี้ (Cookies) และเทคโนโลยีการติดตาม</li>
              <li>IP Address</li>
            </ol>
          </section>

          {/* Section 14 */}
          <section className="bg-surface-container-low p-6 md:p-8 rounded-xl mb-8 space-y-4">
            <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface">14. วัตถุประสงค์ในการเก็บรวบรวมข้อมูล (Purposes of Data Collection)</h2>
            <p className="text-on-surface-variant text-sm">เราเก็บรวบรวมและใช้ข้อมูลส่วนบุคคลของท่านเพื่อวัตถุประสงค์ดังต่อไปนี้: / <span className="italic">We collect and use your personal data for the following purposes:</span></p>

            <h3 className="font-headline font-bold text-base text-on-surface">ฐานสัญญา (Contractual Basis)</h3>
            <ul className="list-disc pl-6 space-y-1 text-on-surface-variant text-sm">
              <li>การสร้างและจัดการบัญชีผู้ใช้งาน / Account creation and management</li>
              <li>การลงทะเบียนและจัดการข้อมูลสัตว์เลี้ยง / Pet registration and data management</li>
              <li>การให้บริการค้นหาสถานที่สำหรับสัตว์เลี้ยง / Providing pet-friendly place search services</li>
              <li>การแจ้งเตือนเกี่ยวกับสัตว์เลี้ยงของท่าน (เช่น วัคซีนครบกำหนด) / Sending pet-related notifications (e.g., vaccination reminders)</li>
            </ul>

            <h3 className="font-headline font-bold text-base text-on-surface">ฐานความยินยอม (Consent Basis)</h3>
            <ul className="list-disc pl-6 space-y-1 text-on-surface-variant text-sm">
              <li>การส่งข้อมูลส่งเสริมการขายและข้อเสนอพิเศษ / Sending promotional information and special offers</li>
              <li>การใช้ข้อมูลตำแหน่งที่ตั้งแบบเรียลไทม์ / Using real-time geolocation data</li>
              <li>การแบ่งปันข้อมูลกับพันธมิตรทางธุรกิจ / Sharing data with business partners</li>
              <li>การวิเคราะห์พฤติกรรมเพื่อปรับปรุงบริการ / Behavioral analysis for service improvement</li>
            </ul>

            <h3 className="font-headline font-bold text-base text-on-surface">ฐานประโยชน์โดยชอบด้วยกฎหมาย (Legitimate Interest Basis)</h3>
            <ul className="list-disc pl-6 space-y-1 text-on-surface-variant text-sm">
              <li>การป้องกันการฉ้อโกงและรักษาความปลอดภัยของแพลตฟอร์ม / Fraud prevention and platform security</li>
              <li>การวิเคราะห์และปรับปรุงประสิทธิภาพของแพลตฟอร์ม / Platform performance analysis and improvement</li>
              <li>การตอบข้อร้องเรียนและคำถามของผู้ใช้งาน / Responding to user complaints and inquiries</li>
            </ul>
          </section>

          {/* Section 15 */}
          <section className="bg-surface-container-low p-6 md:p-8 rounded-xl mb-8 space-y-4">
            <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface">15. การเปิดเผยข้อมูลส่วนบุคคล (Disclosure of Personal Data)</h2>
            <p className="text-on-surface-variant text-sm">เราอาจเปิดเผยข้อมูลส่วนบุคคลของท่านให้กับ: / <span className="italic">We may disclose your personal data to:</span></p>
            <ol className="list-decimal pl-6 space-y-1 text-on-surface-variant text-sm">
              <li>ผู้ให้บริการสถานที่สำหรับสัตว์เลี้ยง (เฉพาะข้อมูลที่จำเป็นต่อการให้บริการ) / Pet-friendly place operators (only data necessary for service provision)</li>
              <li>ผู้ให้บริการด้านเทคโนโลยี (Cloud hosting, analytics, payment processing) / Technology service providers</li>
              <li>พันธมิตรทางธุรกิจ (เฉพาะเมื่อได้รับความยินยอมจากท่าน) / Business partners (only with your consent)</li>
              <li>หน่วยงานรัฐที่มีอำนาจตามกฎหมาย / Authorized government agencies as required by law</li>
              <li>สัตวแพทย์หรือสถานพยาบาลสัตว์ (ในกรณีฉุกเฉิน) / Veterinarians or animal hospitals (in emergencies)</li>
            </ol>
            <div className="bg-secondary-container/30 p-4 rounded-lg">
              <p className="text-on-surface-variant text-sm font-semibold">เราจะไม่ขายข้อมูลส่วนบุคคลของท่านให้กับบุคคลที่สามเพื่อวัตถุประสงค์ทางการตลาด</p>
              <p className="text-on-surface-variant text-sm italic">We will not sell your personal data to third parties for marketing purposes.</p>
            </div>
          </section>

          {/* Section 16 */}
          <section className="bg-surface-container-low p-6 md:p-8 rounded-xl mb-8 space-y-4">
            <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface">16. การโอนข้อมูลระหว่างประเทศ (International Data Transfer)</h2>
            <div className="text-on-surface-variant text-sm leading-relaxed space-y-3">
              <p><strong>16.1</strong> ในกรณีที่มีการโอนข้อมูลส่วนบุคคลของท่านไปยังต่างประเทศ เราจะดำเนินการให้แน่ใจว่าประเทศปลายทางมีมาตรฐานการคุ้มครองข้อมูลที่เพียงพอ หรือจะใช้มาตรการป้องกันที่เหมาะสม เช่น สัญญาการประมวลผลข้อมูล (Data Processing Agreement)</p>
              <p className="italic">In the event of international data transfer, we will ensure that the destination country has adequate data protection standards, or we will implement appropriate safeguards such as a Data Processing Agreement.</p>
            </div>
          </section>

          {/* Section 17 */}
          <section className="bg-surface-container-low p-6 md:p-8 rounded-xl mb-8 space-y-4">
            <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface">17. ระยะเวลาการเก็บรักษาข้อมูล (Data Retention Period)</h2>
            <p className="text-on-surface-variant text-sm">เราจะเก็บรักษาข้อมูลส่วนบุคคลของท่านตามระยะเวลาดังนี้: / <span className="italic">We will retain your personal data for the following periods:</span></p>
            <ul className="list-disc pl-6 space-y-2 text-on-surface-variant text-sm">
              <li><strong>ข้อมูลบัญชีผู้ใช้งาน:</strong> ตลอดระยะเวลาที่บัญชียังใช้งานอยู่ และ 3 ปีหลังจากยกเลิกบัญชี<br /><span className="italic">Account data: Throughout the active period, plus 3 years after termination</span></li>
              <li><strong>ข้อมูลสัตว์เลี้ยง:</strong> ตลอดระยะเวลาที่บัญชียังใช้งานอยู่ และจะถูกลบภายใน 90 วันหลังจากยกเลิกบัญชี<br /><span className="italic">Pet data: Throughout the active period, deleted within 90 days after account termination</span></li>
              <li><strong>ข้อมูลการใช้งานและ Log:</strong> 2 ปี / <span className="italic">Usage data and Logs: 2 years</span></li>
              <li><strong>ข้อมูลทางการเงิน:</strong> ตามที่กฎหมายกำหนด / <span className="italic">Financial data: As required by law</span></li>
            </ul>
          </section>

          {/* Section 18 */}
          <section className="bg-surface-container-low p-6 md:p-8 rounded-xl mb-8 space-y-4">
            <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface">18. สิทธิของเจ้าของข้อมูล (Data Subject Rights)</h2>
            <p className="text-on-surface-variant text-sm">ภายใต้ PDPA ท่านมีสิทธิดังต่อไปนี้: / <span className="italic">Under the PDPA, you have the following rights:</span></p>
            <ol className="list-decimal pl-6 space-y-2 text-on-surface-variant text-sm">
              <li><strong>สิทธิในการเข้าถึง (Right of Access):</strong> ขอสำเนาข้อมูลส่วนบุคคลของท่านที่เราเก็บรักษา</li>
              <li><strong>สิทธิในการแก้ไข (Right to Rectification):</strong> ขอให้เราแก้ไขข้อมูลที่ไม่ถูกต้องหรือไม่ครบถ้วน</li>
              <li><strong>สิทธิในการลบ (Right to Erasure):</strong> ขอให้เราลบข้อมูลส่วนบุคคลของท่านในบางกรณี</li>
              <li><strong>สิทธิในการจำกัดการประมวลผล (Right to Restriction):</strong> ขอให้เราจำกัดการใช้ข้อมูลของท่าน</li>
              <li><strong>สิทธิในการโอนย้ายข้อมูล (Right to Data Portability):</strong> ขอรับข้อมูลของท่านในรูปแบบที่อ่านได้ด้วยเครื่อง</li>
              <li><strong>สิทธิในการคัดค้าน (Right to Object):</strong> คัดค้านการประมวลผลข้อมูลเพื่อวัตถุประสงค์บางประการ</li>
              <li><strong>สิทธิในการถอนความยินยอม (Right to Withdraw Consent):</strong> ถอนความยินยอมที่เคยให้ไว้ได้ตลอดเวลา</li>
              <li><strong>สิทธิในการร้องเรียน (Right to Lodge a Complaint):</strong> ยื่นเรื่องร้องเรียนต่อคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล</li>
            </ol>
            <div className="bg-primary-container/20 p-4 rounded-lg">
              <p className="text-on-surface-variant text-sm">หากท่านต้องการใช้สิทธิใด ๆ กรุณาติดต่อเราที่ contact@pethabitat.com เราจะดำเนินการตามคำขอของท่านภายใน 30 วัน</p>
              <p className="text-on-surface-variant text-sm italic">To exercise any of these rights, please contact us at contact@pethabitat.com. We will process your request within 30 days.</p>
            </div>
          </section>

          {/* Section 19 */}
          <section className="bg-surface-container-low p-6 md:p-8 rounded-xl mb-8 space-y-4">
            <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface">19. นโยบายคุกกี้ (Cookie Policy)</h2>
            <p className="text-on-surface-variant text-sm">เราใช้คุกกี้และเทคโนโลยีที่คล้ายกันดังนี้: / <span className="italic">We use cookies and similar technologies as follows:</span></p>

            <div className="space-y-4">
              <div className="p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10">
                <h4 className="font-bold text-sm text-on-surface mb-1">คุกกี้ที่จำเป็น (Strictly Necessary Cookies)</h4>
                <p className="text-on-surface-variant text-sm">จำเป็นต่อการทำงานพื้นฐานของแพลตฟอร์ม เช่น การเข้าสู่ระบบ การตั้งค่าภาษา ไม่สามารถปิดการใช้งานได้</p>
                <p className="text-on-surface-variant text-sm italic">Required for basic Platform functionality such as login and language settings. Cannot be disabled.</p>
              </div>
              <div className="p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10">
                <h4 className="font-bold text-sm text-on-surface mb-1">คุกกี้เพื่อประสิทธิภาพ (Performance Cookies)</h4>
                <p className="text-on-surface-variant text-sm">เก็บข้อมูลเกี่ยวกับวิธีที่ท่านใช้งานแพลตฟอร์ม เพื่อปรับปรุงประสิทธิภาพ (เช่น Google Analytics)</p>
                <p className="text-on-surface-variant text-sm italic">Collect information about how you use the Platform to improve performance (e.g., Google Analytics).</p>
              </div>
              <div className="p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10">
                <h4 className="font-bold text-sm text-on-surface mb-1">คุกกี้เพื่อการโฆษณา (Advertising Cookies)</h4>
                <p className="text-on-surface-variant text-sm">ใช้เพื่อแสดงโฆษณาที่เกี่ยวข้องกับท่าน ท่านสามารถปฏิเสธคุกกี้ประเภทนี้ได้</p>
                <p className="text-on-surface-variant text-sm italic">Used to display relevant advertisements. You may decline these cookies.</p>
              </div>
            </div>
          </section>

          {/* Section 20 */}
          <section className="bg-surface-container-low p-6 md:p-8 rounded-xl mb-8 space-y-4">
            <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface">20. มาตรการรักษาความปลอดภัย (Security Measures)</h2>
            <p className="text-on-surface-variant text-sm">เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสม ได้แก่: / <span className="italic">We implement appropriate security measures including:</span></p>
            <ul className="list-disc pl-6 space-y-1 text-on-surface-variant text-sm">
              <li>การเข้ารหัสข้อมูล (Data encryption) ทั้งระหว่างการส่ง (in transit) และการจัดเก็บ (at rest)</li>
              <li>การควบคุมการเข้าถึงข้อมูล (Access controls) ตามหลัก least privilege</li>
              <li>การตรวจสอบสิทธิ์แบบหลายปัจจัย (Multi-factor authentication) สำหรับระบบภายใน</li>
              <li>การสำรองข้อมูลเป็นประจำ (Regular data backups)</li>
              <li>การทดสอบความปลอดภัย (Security testing) และการตรวจสอบช่องโหว่เป็นระยะ</li>
              <li>การฝึกอบรมพนักงานด้านการคุ้มครองข้อมูล (Staff data protection training)</li>
            </ul>
          </section>

          {/* Section 21 */}
          <section className="bg-surface-container-low p-6 md:p-8 rounded-xl mb-8 space-y-4">
            <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface">21. การคุ้มครองข้อมูลผู้เยาว์ (Protection of Minors&apos; Data)</h2>
            <div className="text-on-surface-variant text-sm leading-relaxed space-y-3">
              <p><strong>21.1</strong> แพลตฟอร์มนี้ไม่ได้ออกแบบมาเพื่อผู้ที่มีอายุต่ำกว่า 20 ปี หากเราทราบว่าได้เก็บข้อมูลของผู้เยาว์โดยไม่ได้รับความยินยอมจากผู้ปกครอง เราจะดำเนินการลบข้อมูลดังกล่าวโดยเร็ว</p>
              <p className="italic">This Platform is not designed for individuals under 20 years of age. If we learn that we have collected data from a minor without parental consent, we will delete such data promptly.</p>
            </div>
          </section>

          {/* Section 22 */}
          <section className="bg-surface-container-low p-6 md:p-8 rounded-xl mb-8 space-y-4">
            <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface">22. การเปลี่ยนแปลงนโยบาย (Policy Changes)</h2>
            <div className="text-on-surface-variant text-sm leading-relaxed space-y-3">
              <p><strong>22.1</strong> เราอาจปรับปรุงนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว การเปลี่ยนแปลงที่สำคัญจะได้รับการแจ้งเตือนผ่านแพลตฟอร์มหรืออีเมลล่วงหน้าอย่างน้อย 30 วัน</p>
              <p className="italic">We may update this Privacy Policy from time to time. Material changes will be notified via the Platform or email at least 30 days in advance.</p>
              <p><strong>22.2</strong> การที่ท่านยังคงใช้งานแพลตฟอร์มต่อไปหลังจากการเปลี่ยนแปลงมีผลบังคับใช้ ถือว่าท่านยอมรับนโยบายที่แก้ไขแล้ว</p>
              <p className="italic">Your continued use of the Platform after changes take effect constitutes acceptance of the revised policy.</p>
            </div>
          </section>

          {/* Section 23 */}
          <section className="bg-primary-container/10 p-6 md:p-8 rounded-xl mb-8 space-y-4 border border-primary/10">
            <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface">23. ช่องทางติดต่อ (Contact Information)</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              หากท่านมีคำถามหรือข้อสงสัยเกี่ยวกับข้อกำหนดและเงื่อนไข หรือนโยบายความเป็นส่วนตัว กรุณาติดต่อเราที่:
            </p>
            <p className="text-on-surface-variant text-sm italic leading-relaxed">
              If you have any questions or concerns regarding these Terms and Conditions or Privacy Policy, please contact us at:
            </p>
            <div className="bg-surface-container-lowest p-4 rounded-lg">
              <p className="font-bold text-on-surface">PetHabitat</p>
              <p className="text-on-surface-variant text-sm">Email: contact@pethabitat.com</p>
            </div>
          </section>
        </article>
      </main>
      <Footer />
      <BottomNav />
    </Providers>
  );
}
