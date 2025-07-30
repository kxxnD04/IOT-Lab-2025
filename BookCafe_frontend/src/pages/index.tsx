import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-1.jpg";
import KarnImage from "../assets/images/Switch.jpg";

export default function HomePage() {
  return (
    <Layout>
      {/* Hero Section with modern green theme */}
      <section className="relative h-[600px] w-full overflow-hidden">
        {/* Background with green gradient overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${cafeBackgroundImage})`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/90 via-emerald-500/85 to-teal-600/90"></div>
        
        {/* Decorative elements using CSS and Unicode symbols */}
        <div className="absolute top-10 left-10 text-green-200/30 text-6xl animate-pulse">
          🌲
        </div>
        <div className="absolute top-20 right-20 text-green-200/20 text-4xl animate-bounce">
          🍃
        </div>
        <div className="absolute bottom-20 left-20 text-green-200/25 text-3xl">
          ☕
        </div>
        <div className="absolute bottom-10 right-10 text-green-200/30 text-5xl">
          📚
        </div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
        
        {/* Main content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center px-4 text-center text-white">
          <div className="backdrop-blur-sm bg-white/10 rounded-3xl p-8 border border-white/20 mb-8">
            <h1 className="text-6xl font-light mb-4 leading-tight">
              ยินดีต้อนรับสู่ 
              <span className="block text-4xl mt-2 font-normal text-green-100">
                IoT Library & Cafe
              </span>
            </h1>
            <h2 className="text-xl font-light text-green-50 max-w-2xl leading-relaxed">
              ร้านกาแฟที่มีหนังสืออยู่นิดหน่อยให้คุณได้อ่าน
            </h2>
          </div>
          
          {/* Feature icons */}
          <div className="flex gap-8 text-green-100">
            <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
              <span className="text-lg">☕</span>
              <span className="text-sm">กาแฟคุณภาพ</span>
            </div>
            <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
              <span className="text-lg">📚</span>
              <span className="text-sm">ห้องสมุด</span>
            </div>
            <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
              <span className="text-lg">📶</span>
              <span className="text-sm">IoT Tech</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section with modern card design */}
      <section className="container mx-auto py-16 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-800 mb-4 relative inline-block">
            เกี่ยวกับเรา
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Main content card */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-white text-xl">
                ☕
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">IoT Library & Cafe</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
              </div>
            </div>
            
            <p className="text-gray-600 leading-relaxed text-lg">
              IoT Library & Cafe เป็นร้านกาแฟที่มีหนังสืออยู่นิดหน่อยให้คุณได้อ่าน
              และเรียนรู้เรื่องใหม่ๆ ที่เกี่ยวกับเทคโนโลยี IoT โดยคาเฟ่ของเรานั้น ก่อตั้งขึ้นโดย
              ผศ.ดร. ปานวิทย์ ธุวะนุติ ซึ่งเป็นอาจารย์ในวิชา Internet of Things
              โค้ดชุดนี้เป็นโค้ดตัวอย่างในหัวข้อ Hono และ React ในวิชานี้
            </p>
          </div>

          {/* Image card */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
            <img 
              src={KarnImage} 
              alt="Karn Suddee" 
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Additional info card */}
        <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center text-white text-lg">
              🍃
            </div>
            <h3 className="text-lg font-medium text-gray-800">ข้อมูลเพิ่มเติม</h3>
          </div>
          
          <p className="text-gray-600 leading-relaxed">
            ปัจจุบันคาเฟ่ และห้องสมุดของเรา อยู่ในช่วงการดูแลของ ....
            {/* TODO: ชื่อของตนเอง, รหัสประจำตัวนักศึกษา และแนะนำคาเฟ่นี้ต่ออีกสักหน่อย + ใส่รูปของตนเอง (ไม่จำเป็นหากไม่สะดวกใจใส่รูป) */}
            ซึ่งมีบริการ... Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
            placeat sit ea sapiente officia sunt cumque impedit, reiciendis quis eius asperiores!
            Minus, mollitia? Vitae inventore odio quod ducimus similique, expedita sequi, reiciendis
            rem recusandae impedit voluptatibus quo veritatis ut quis et suscipit? Eligendi, neque!
            Earum quaerat unde similique totam. Pariatur!
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-xl p-6 shadow-md border border-green-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-4 text-white text-xl">
              ☕
            </div>
            <h4 className="font-medium text-gray-800 mb-2">เครื่องดื่มพรีเมียม</h4>
            <p className="text-gray-600 text-sm leading-relaxed">กาแฟและเครื่องดื่มคุณภาพสูง</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md border border-green-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-4 text-white text-xl">
              📚
            </div>
            <h4 className="font-medium text-gray-800 mb-2">ห้องสมุดดิจิทัล</h4>
            <p className="text-gray-600 text-sm leading-relaxed">หนังสือและทรัพยากร IoT</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md border border-green-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-4 text-white text-xl">
              📶
            </div>
            <h4 className="font-medium text-gray-800 mb-2">เทคโนโลยี IoT</h4>
            <p className="text-gray-600 text-sm leading-relaxed">สภาพแวดล้อมการเรียนรู้ที่ทันสมัย</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}