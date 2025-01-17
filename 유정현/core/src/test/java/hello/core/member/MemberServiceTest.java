package hello.core.member;

import hello.core.AppConfig;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class MemberServiceTest {

    //기존
//    MemberService memberService = new MemberSerivceImpl();

    MemberService memberService;

  @BeforeEach //Test 실행 전에 무조건 실행된다는 뜻
  public void beforeEach(){
      AppConfig appConfig = new AppConfig();
      memberService = appConfig.memberService();
  }

    @Test
    void join(){

        //given
        Member member = new Member(1L, "memberA",Grade.VIP);

        //when
        memberService.join(member);
        Member findMember = memberService.findMember(1L);

        //then
        Assertions.assertThat(member).isEqualTo(findMember);
        //조인한 것과 찾은 것이 똑같은 지 확인
    }
}
