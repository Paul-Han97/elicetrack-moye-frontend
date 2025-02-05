import { S } from './EntryPoint.style';
import ROUTE_LINK from '../../routes/RouterLink';

const EntryPoint = () => {
  return (
    <S.EntryPointBox>
      <S.BoxOverlay>
        <S.Logo />
        <S.AuthBox>
          <S.LinkButton to={ROUTE_LINK.LOGIN.link}>로그인</S.LinkButton>
          <S.LinkButton to={ROUTE_LINK.SIGNUP.link}>회원가입</S.LinkButton>
        </S.AuthBox>
      </S.BoxOverlay>
    </S.EntryPointBox>
  );
};

export default EntryPoint;
