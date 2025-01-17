import org.junit.jupiter.api.Test;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

public class JUnitQuiz {
    @Test
    public void junitTest() {
        int number1 = 15;
        int number2 = 0;
        int number3 = -5;

        assertThat(number1).isPositive();

        assertThat(number2).isZero();

        assertThat(number3).isNegative();

        assertThat(number1).isGreaterThan(number2);

        assertThat(number3).isLessThan(number2);
    }
}
