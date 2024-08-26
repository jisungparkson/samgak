const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
const day = String(today.getDate()).padStart(2, '0');
const dateString = `${year}${month}${day}`; // 올바른 템플릿 리터럴 사용

const apiUrl = `https://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=F10&SD_SCHUL_CODE=7391106&MLSV_YMD=${dateString}&Type=json`;

console.log(apiUrl); // 디버깅을 위해 URL을 출력하여 확인해보세요.

// 급식 데이터를 가져오는 코드
async function fetchMealData() {
    const mealList = document.getElementById('mealList');
    mealList.innerHTML = ''; // 기존 내용을 지움

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('네트워크 응답이 올바르지 않습니다.');
        }

        const data = await response.json();

        // 네이스 API 구조에 따라 데이터 추출
        if (data.mealServiceDietInfo && data.mealServiceDietInfo[1] && data.mealServiceDietInfo[1].row) {
            const mealData = data.mealServiceDietInfo[1].row[0].DDISH_NM;

            // 식단 텍스트 처리 (줄바꿈)
            const mealItems = mealData.split('<br/>');

            mealItems.forEach(meal => {
                const mealItem = document.createElement('li');
                mealItem.className = 'list-group-item';
                mealItem.textContent = meal;
                mealList.appendChild(mealItem);
            });
        } else {
            mealList.innerHTML = '<li class="list-group-item">오늘의 급식 정보가 없습니다.</li>';
        }
    } catch (error) {
        console.error('급식 정보를 가져오는 중 오류가 발생했습니다:', error);
        mealList.innerHTML = '<li class="list-group-item">급식 정보를 가져오는 데 실패했습니다.</li>';
    }
}

// 이 코드를 실행해 급식 데이터를 가져옵니다.
fetchMealData();
