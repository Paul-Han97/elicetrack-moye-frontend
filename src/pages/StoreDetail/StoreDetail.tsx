import { useState, useEffect } from 'react';
import { SD } from './StoreDetail.ts';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ROUTE_LINK from '../../routes/RouterLink.ts';
import {
  StoreDetailData,
  initialState,
  StoreImage,
} from './StoreDetailInterface.ts';
import OperatingTimeTable from './OperatingTimeTable.tsx';
import { APIS } from '../../config/config.ts';
import { RootState } from '../../store/store.ts';

const StoreDetail = () => {
  const [storeData, setStoreData] = useState<StoreDetailData>(initialState);
  const storeId = useSelector((state: RootState) => state.auth.store?.id);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    async function asyncCall() {
      let imageSrc = '';

      await axios
        .get(`${APIS.store}/${storeId}`)
        .then((res) => {
          setStoreData(res.data.body);
          imageSrc = res.data.body.image.filter(
            (item: StoreImage) => item.url !== '' && item.url !== null,
          )[0].url;
          console.log(res.data.body);
        })
        .catch((error) => {
          console.log('Error: ', error);
        });
      const getURL = `${APIS.getImageBase}${imageSrc}`;

      await axios
        .get(getURL, {
          responseType: 'blob',
        })
        .then((res) => {
          const newFile = new File([res.data], 'storeImg');
          const reader = new FileReader();
          reader.onload = (event) => {
            const previewImage = String(event.target?.result);
            setPreviewImage(previewImage);
          };
          reader.readAsDataURL(newFile);
        })
        .catch((error) => {
          console.log('Error: ', error);
        });
    }
    asyncCall();
  }, [storeId]);

  return (
    <>
      <SD.TopBar>
        <p>매장이름</p>
        <Link
          to={`${ROUTE_LINK.STOREEDIT.link}${storeId}/edit`}
          state={{ data: storeData }}
        >
          <button>편집</button>
        </Link>
      </SD.TopBar>
      <SD.Body>
        <SD.BodyLeft>
          <img src={previewImage} alt="매장사진"></img>
          <ul>
            <li>
              <span>상호명</span>: {storeData.businessName}
            </li>
            <li>
              <span>사업자 번호</span>: {storeData.businessRegistrationNumber}
            </li>
            <li>
              <span>매장 전화번호</span>: {storeData.contact}
            </li>
            <li>
              <span>매장 이메일</span>: {storeData.email}
            </li>
            <br />
            <li>
              <span>전체 좌석 수</span>: {storeData.totalSeats}석
            </li>
            <li>
              <span>테이블당 예약 가능한 최대 인원</span>:{' '}
              {storeData.numberPerTable}명
            </li>
          </ul>
        </SD.BodyLeft>
        <SD.BodyRight>
          <SD.Description>
            <span>Description</span>
            <br />
            <br />
            <p>{storeData.description}</p>
          </SD.Description>
          <OperatingTimeTable
            openingHour={storeData.openingHour}
            regularHoliday={storeData.regularHoliday}
            closedDay={storeData.closedDay}
          />
        </SD.BodyRight>
      </SD.Body>
    </>
  );
};

export default StoreDetail;
