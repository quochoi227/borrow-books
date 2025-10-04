<script setup>
</script>
<template>
  <select
    class="select select-bordered h-48"
    multiple
    v-model="selectedGenres"
  >
    <optgroup label="Thể loại phổ biến">
      <option value="Tiểu thuyết">Tiểu thuyết</option>
      <option value="Truyện ngắn">Truyện ngắn</option>
      <option value="Truyện trinh thám">Truyện trinh thám</option>
      <option value="Truyện kinh dị">Truyện kinh dị</option>
      <option value="Truyện ngôn tình">Truyện ngôn tình</option>
      <option value="Truyện cổ tích">Truyện cổ tích</option>
      <option value="Truyện thiếu nhi">Truyện thiếu nhi</option>
      <option value="Truyện cười">Truyện cười</option>
      <option value="Truyện lịch sử">Truyện lịch sử</option>
      <option value="Truyện dân gian">Truyện dân gian</option>
    </optgroup>

    <optgroup label="Sách học thuật & kỹ năng">
      <option value="Sách giáo khoa">Sách giáo khoa</option>
      <option value="Sách tham khảo">Sách tham khảo</option>
      <option value="Sách luyện thi">Sách luyện thi</option>
      <option value="Sách kỹ năng sống">Sách kỹ năng sống</option>
      <option value="Sách phát triển bản thân">Sách phát triển bản thân</option>
      <option value="Sách tâm lý học">Sách tâm lý học</option>
      <option value="Sách quản trị kinh doanh">Sách quản trị kinh doanh</option>
      <option value="Sách marketing">Sách marketing</option>
      <option value="Sách tài chính – đầu tư">Sách tài chính – đầu tư</option>
    </optgroup>

    <optgroup label="Sách chuyên đề & đời sống">
      <option value="Sách nấu ăn">Sách nấu ăn</option>
      <option value="Sách sức khỏe – dinh dưỡng">Sách sức khỏe – dinh dưỡng</option>
      <option value="Sách du lịch">Sách du lịch</option>
      <option value="Sách nghệ thuật – thiết kế">Sách nghệ thuật – thiết kế</option>
      <option value="Sách tôn giáo – tâm linh">Sách tôn giáo – tâm linh</option>
      <option value="Sách khoa học – công nghệ">Sách khoa học – công nghệ</option>
      <option value="Sách môi trường – thiên nhiên">Sách môi trường – thiên nhiên</option>
    </optgroup>
  </select>
</template>
