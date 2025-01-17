package hello.core;

import hello.core.discount.DiscountPolicy;
import hello.core.discount.FixDisountPolicy;
import hello.core.discount.RateDiscountPolicy;
import hello.core.member.MemberSerivceImpl;
import hello.core.member.MemberService;
import hello.core.member.MemoryMemberRepository;
import hello.core.order.OrderService;
import hello.core.order.OrderServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    // 애플리케이션의 실제 동작에 필요한 구현 객체를 생성하는 역할을 한다.
    // 생성한 객체 인스턴스의 참조(레퍼런스)를 생성자를 통해서 주입해준다.

    @Bean
    public MemberService memberService(){
        return new MemberSerivceImpl(memberRepository());
    }

    @Bean
    public static MemoryMemberRepository memberRepository() {
        return new MemoryMemberRepository();
    }

    @Bean
    public OrderService orderService(){
        return new OrderServiceImpl(memberRepository(), discountPolicy());
    }

    @Bean
    public DiscountPolicy discountPolicy(){
//        return new FixDisountPolicy();
        //할인 정책 변경 시
        return new RateDiscountPolicy();
    }

}
