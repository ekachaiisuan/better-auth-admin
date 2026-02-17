ความสำเร็จ
1. config better-auth เข้ากับ drizzle
2. set Dashboard shadcn
3. ตั้งค่าให้ auth เปิดใช้ emailPassword และกำหนด Cache เพื่อ Optimize ระบบให้เร็วไม่ต้องยิง query ทุกครั้งที่ตรวจสอบ session
3. อยู่ระหว่างทำ login กับ signUp
4. ทำ signUp เสร็จแล้ว ตรวจสอบ session ได้
5. ทำ signIn เสร็จ ติดตั้ง Arcjet เพื่อป้องกันการโจมตี ทำ Rate Limit Brute Force
6. วางแนวป้องกันก่อนเข้าถึง singUp ต่อ cloneRequest
7. ทำ EmailVerify หลังจาก signUp จะแจ้งให้ verify email