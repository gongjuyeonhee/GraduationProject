# 5gaso - graduation project
------------
## 프로젝트 소개
> 앱의 이름 "5gaso(오가소)"는 "오세요, 가세요"를 나타내는 말을 기반으로 만들어졌으며, 학교 주변에서 버스 이용이 불편한 상황에서 교통비를 절약하고자 하는 사용자들을 대상으로 합니다. 
5gaso를 사용하면 사용자들은 빠르게 글을 올리고 다른 이용자들과 함께 교통을 이용하기 위해 모일 수 있습니다. 다수와 함께 교통을 이용하면 혼자 탈 때보다 부담해야 하는 교통비를 절약할 수 있으며, 이를 위한 택시나 카풀 모임을 쉽게 조직할 수 있다는 점이 있습니다.

------------
### 앱 구성
> 5gaso 프로젝트는 react-native와 expo로 만들어졌습니다. 또한 데이터 업로드 및 저장을 위해 firebase를 사용했습니다.
>>firebase SDK
```
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
  measurementId: "YOUR_MEASUREMENT_ID",
  databaseURL: "YOUR_DATABASE_URL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { auth, database, storage, db };
export default app;
```
참고 문헌: https://firebase.google.com/docs/web/setup?hl=ko
