##Requirement: 
    - Hệ thống cho phép Mod đặt lịch dạy vào các ngày trong tuần 
    - User có thể đặt nhiều lớp học trong một ngày.
    - Mod có thể đặt lịch giảng dạy vào các ngày trong tuần và các buổi trong ngày
    - User có thể đặt lịch vào lịch available của mod đã đặt từ trước 
    - User có thể talk now với mod khi mod đang trong giờ làm việc và không có buổi học nào đang diễn ra
#Các chức năng:
    - Hiển thị các buổi available của mod để user có thể đặt lịch lên các buổi đấy và ẩn các buổi đã đặt của user khác với mod
    - Hiển thị các khung thời gian học trong đặt lịch sao cho một lớp diễn ra trong khoảng 30p (vd: 8h30 - 9h - 9h30 - 10h…)
    - Đặt lịch: User đặt lịch với mod, hệ thống sẽ kiểm tra số buổi học của user sau đó kiểm tra trạng thái của mod => false:  return kết quả cho user. Success: hệ thống gửi yêu cầu chờ Mod xác nhận yêu cầu đặt của user và trừ đi số buổi học của user => hệ thống tự cập nhật lại available_time của mod. 
    - Mod huỷ buổi học: update lại số buổi học cho người dùng
#Các trường hợp:
    > VD: Mod có lịch hẹn với user1 lúc 9h => user2 không thể talk now với mod trong khoảng thời gian từ 8h30 -> 9h30 => mod status (8h30 -> 9h30 = busy)
    > Khi user đặt lịch với mod và mod chưa confirm lịch khoảng 30p trước khi buổi học bắt đầu thì lịch sẽ tự động hủy và hoàn lại buổi học cho user và thông báo cho user
#Model:
    [User]: user_id, user-name, remaining_lessions
    [Mod]: mod_id, mod_name, status, available_time []
    [Room]: room_id, user_id, mod_id, state, start_time, end_time, create_at, update_at
