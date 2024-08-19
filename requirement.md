# Yêu cầu:

-   Hệ thống cho phép Mod đặt lịch dạy vào các ngày trong tuần và không được trùng lịch
-   Mod có thể hủy lịch đã đặt và hoàn trả lại các buổi học cho các user đã đặt lịch vào lịch đã hủy đó
-   Mod có thể hủy lịch của user đã đặt và hoàn trả lại số buổi học cho user
-   Mod xác nhận buổi học của user và tự động hủy các đặt lịch của user khác vào thời gian đã confirm
-   User có thể đặt lịch nhiều lớp học theo lịch của mod đã đặt từ trước
-   User có thể hủy lịch của đã đặt và được hoàn trả lại buổi học đã đặt

# Các chức năng và luồng xử lý:

-   Mod đặt lịch: Hệ thống chỉ cho phép Mod đặt các lịch không bị trùng thời gian với các lịch đã đặt.
-   Hiển thị các Mod đang online cho User
-   Hiển thị các lịch available của Mod đã nếu User vẫn còn số buổi học
-   User đặt lịch: Hệ thống sẽ kiểm tra lịch của Mod còn available không, nếu còn -> cho phép User đặt lịch và trừ đi một buổi học của User và chờ Mod xác nhận
-   User hủy lịch: Hệ thống sẽ xác nhận là User hủy lịch và cộng lại số buổi họ cho User
-   Mod hủy buổi học của User: Hệ thống sẽ xác nhận Mod đã hủy và hoàn trả buổi học cho user
-   Mod xác nhận buổi học của User: Hệ thống sẽ xác nhận buổi học của User và khóa lịch của mod đã confirm
-   Mod hủy buổi học của User sau khi đã xác nhận: Hệ thống sẽ cập nhật lại trạng thái lịch của mod và hoàn trả số buổi học cho User
-   Mod huỷ lịch đã đặt: Hệ thống cập nhật trạng thái xóa của lịch và hoàn trả lại các buổi học cho các User đã đặt vào lịch (cả đã xác nhận và chưa xác nhận)
-   Hệ thống sẽ kiểm tra tình trạng đặt lịch và tạo phòng trước 2 phút khi phòng học bắt đầu.
-   Hệ thống sẽ tự động hủy lịch của User nếu không được Mod xác nhận trước 2 phút khi buôi học bắt đầu
