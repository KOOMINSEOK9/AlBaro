package hello.core;

import hello.core.member.Grade;
import hello.core.member.Member;
import hello.core.member.MemberSerivceImpl;
import hello.core.member.MemberService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class MemberApp {
    public static void main(String[] args) {

//        MemberService memberService = new MemberSerivceImpl(); //기존 방식

//        AppConfig appConfig = new AppConfig();
//        MemberService memberService = appConfig.memberService(); //AppConfig에서 꺼내와야 함
        // --> memberService 안에는 memberServiceImpl이 들어있다!

        ApplicationContext applicationContext = new AnnotationConfigApplicationContext(AppConfig.class);
        // @Bean이라고 하는 객체들을 전부 관리해준다!
        MemberService memberService =  applicationContext.getBean("memberService",MemberService.class);
        //앞에는 메서드 이름 적용

        Member member = new Member(1L,"memberA", Grade.VIP);
        memberService.join(member);

        Member findMember = memberService.findMember(1L);
        System.out.println("new member = "+ member.getName());
        System.out.println("findMember =  "+ findMember.getName());
    }
}
