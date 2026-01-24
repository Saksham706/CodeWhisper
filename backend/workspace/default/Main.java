import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        // Taking input
        System.out.print("Enter two numbers: ");
        int a = sc.nextInt();
        int b = sc.nextInt();

        // Processing
        int sum = a + b;

        // Output
        System.out.println("Sum = " + sum);

        sc.close();
    }
}
