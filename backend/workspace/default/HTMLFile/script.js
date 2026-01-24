function calculateSum() {
    const num1 = document.getElementById("num1").value;
    const num2 = document.getElementById("num2").value;

    if (num1 === "" || num2 === "") {
        document.getElementById("result").innerText = "Please enter both numbers";
        return;
    }

    const sum = Number(num1) + Number(num2);
    document.getElementById("result").innerText = "Sum = " + sum;
}
